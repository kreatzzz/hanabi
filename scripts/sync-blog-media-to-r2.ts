import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

type MediaRow = {
  id: number;
  prefix: string | null;
  filename: string;
  filesize: string | null;
  mime_type: string | null;
  url: string | null;
  sizes_thumbnail_filename: string | null;
  sizes_thumbnail_filesize: string | null;
  sizes_thumbnail_mime_type: string | null;
  sizes_thumbnail_url: string | null;
  sizes_card_filename: string | null;
  sizes_card_filesize: string | null;
  sizes_card_mime_type: string | null;
  sizes_card_url: string | null;
  sizes_social_filename: string | null;
  sizes_social_filesize: string | null;
  sizes_social_mime_type: string | null;
  sizes_social_url: string | null;
  sizes_wide_filename: string | null;
  sizes_wide_filesize: string | null;
  sizes_wide_mime_type: string | null;
  sizes_wide_url: string | null;
};

type ObjectFile = {
  filename: string;
  path: string;
  size: number;
  mimeType: string;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localMedia = path.join(root, "media");
const sizes = ["thumbnail", "card", "social", "wide"] as const;
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const confirmedBucket = args
  .find((arg) => arg.startsWith("--confirm-bucket="))
  ?.split("=")[1];

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function safeFilename(filename: string): string {
  if (
    !filename ||
    path.basename(filename) !== filename ||
    filename.includes("..") ||
    encodeURIComponent(filename) !== filename
  ) {
    throw new Error(`Unsafe media filename: ${filename}`);
  }
  return filename;
}

function expectedLocalUrl(filename: string) {
  return `/cms-api/media/file/${filename}`;
}

async function main() {
  const databaseUrl = new URL(requiredEnv("DIRECT_URL"));
  if (databaseUrl.searchParams.get("sslmode") === "require") {
    databaseUrl.searchParams.set("sslmode", "verify-full");
  }
  const bucket = requiredEnv("PAYLOAD_R2_BUCKET");
  const mediaBaseUrl = requiredEnv("PAYLOAD_MEDIA_BASE_URL").replace(
    /\/+$/,
    "",
  );
  const publicBaseUrl = `${mediaBaseUrl}/blog/`;
  const endpoint = requiredEnv("PAYLOAD_R2_ENDPOINT");
  const accessKeyId = requiredEnv("PAYLOAD_R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("PAYLOAD_R2_SECRET_ACCESS_KEY");

  if (apply && confirmedBucket !== bucket) {
    throw new Error("--apply requires --confirm-bucket=<PAYLOAD_R2_BUCKET>");
  }
  if (!endpoint.endsWith(".r2.cloudflarestorage.com")) {
    throw new Error("Expected a Cloudflare R2 endpoint");
  }
  if (new URL(mediaBaseUrl).protocol !== "https:") {
    throw new Error("PAYLOAD_MEDIA_BASE_URL must use HTTPS");
  }

  const db = new pg.Client({ connectionString: databaseUrl.toString() });
  await db.connect();
  let dbClosed = false;
  try {
    const result = await db.query<MediaRow>(
      "SELECT id, prefix, filename, filesize, mime_type, url, " +
        sizes
          .flatMap((size) => [
            `sizes_${size}_filename`,
            `sizes_${size}_filesize`,
            `sizes_${size}_mime_type`,
            `sizes_${size}_url`,
          ])
          .join(", ") +
        " FROM payload.media WHERE _objectkey IS NULL ORDER BY id",
    );
    if (result.rowCount === 0)
      throw new Error("No Payload media records found");

    const objects = new Map<string, ObjectFile>();
    let alreadyMigrated = 0;
    for (const row of result.rows) {
      if (row.prefix !== "blog") {
        throw new Error(`Media ${row.id} is outside the blog prefix`);
      }
      const addFile = async (
        filename: string | null,
        recordedSize: string | null,
        mimeType: string | null,
        url: string | null,
      ) => {
        if (!filename) {
          if (url)
            throw new Error(`Media ${row.id} has a URL without a filename`);
          return;
        }
        safeFilename(filename);
        const expectedRemoteUrl = `${publicBaseUrl}${encodeURIComponent(filename)}`;
        if (url !== expectedLocalUrl(filename) && url !== expectedRemoteUrl) {
          throw new Error(
            `Media ${row.id} has an unexpected URL for ${filename}`,
          );
        }
        const filePath = path.join(localMedia, filename);
        const fileStat = await stat(filePath);
        if (!fileStat.isFile() || fileStat.size !== Number(recordedSize)) {
          throw new Error(`Media ${row.id} byte count differs for ${filename}`);
        }
        const existing = objects.get(filename);
        if (existing && existing.size !== fileStat.size) {
          throw new Error(`Conflicting files named ${filename}`);
        }
        objects.set(filename, {
          filename,
          path: filePath,
          size: fileStat.size,
          mimeType: mimeType ?? "image/jpeg",
        });
      };

      await addFile(row.filename, row.filesize, row.mime_type, row.url);
      for (const size of sizes) {
        await addFile(
          row[`sizes_${size}_filename`],
          row[`sizes_${size}_filesize`],
          row[`sizes_${size}_mime_type`],
          row[`sizes_${size}_url`],
        );
      }
      if (row.url?.startsWith(publicBaseUrl)) alreadyMigrated += 1;
    }

    const files = [...objects.values()];
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    console.log(
      JSON.stringify(
        {
          bucket,
          prefix: "blog/",
          publicBaseUrl,
          records: result.rowCount,
          alreadyMigrated,
          files: files.length,
          bytes: totalBytes,
          mode: apply ? "apply" : "dry-run",
        },
        null,
        2,
      ),
    );
    if (!apply) return;

    await db.end();
    dbClosed = true;

    const s3 = new S3Client({
      endpoint,
      region: "auto",
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });
    let nextIndex = 0;
    let verified = 0;
    let uploaded = 0;
    const workers = Array.from({ length: 8 }, async () => {
      while (nextIndex < files.length) {
        const file = files[nextIndex++];
        if (!file) break;
        const key = `blog/${file.filename}`;
        const buffer = await readFile(file.path);
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        let existing = false;
        try {
          const head = await s3.send(
            new HeadObjectCommand({ Bucket: bucket, Key: key }),
          );
          if (
            head.ContentLength !== file.size ||
            head.Metadata?.sha256 !== sha256
          ) {
            throw new Error(`R2 object differs from local source: ${key}`);
          }
          existing = true;
        } catch (error) {
          if (!(error instanceof Error && error.name === "NotFound"))
            throw error;
        }
        if (!existing) {
          await s3.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: buffer,
              ContentLength: file.size,
              ContentType: file.mimeType,
              CacheControl: "public, max-age=31536000, immutable",
              IfNoneMatch: "*",
              Metadata: { sha256 },
            }),
          );
          uploaded += 1;
        }
        const head = await s3.send(
          new HeadObjectCommand({ Bucket: bucket, Key: key }),
        );
        if (
          head.ContentLength !== file.size ||
          head.Metadata?.sha256 !== sha256
        ) {
          throw new Error(`R2 verification failed: ${key}`);
        }
        verified += 1;
        if (verified % 250 === 0 || verified === files.length) {
          console.log(
            `Verified ${verified}/${files.length} objects (${uploaded} uploaded)`,
          );
        }
      }
    });
    const results = await Promise.allSettled(workers);
    const failed = results.find((result) => result.status === "rejected");
    if (failed?.status === "rejected") throw failed.reason;

    const writer = new pg.Client({ connectionString: databaseUrl.toString() });
    await writer.connect();
    try {
      await writer.query("BEGIN");
      const updated = await writer.query(
        `UPDATE payload.media SET
          url = $1 || filename,
          sizes_thumbnail_url = CASE WHEN sizes_thumbnail_filename IS NOT NULL THEN $1 || sizes_thumbnail_filename END,
          sizes_card_url = CASE WHEN sizes_card_filename IS NOT NULL THEN $1 || sizes_card_filename END,
          sizes_social_url = CASE WHEN sizes_social_filename IS NOT NULL THEN $1 || sizes_social_filename END,
          sizes_wide_url = CASE WHEN sizes_wide_filename IS NOT NULL THEN $1 || sizes_wide_filename END
        WHERE prefix = 'blog'
          AND _objectkey IS NULL
          AND url = '/cms-api/media/file/' || filename`,
        [publicBaseUrl],
      );
      if (updated.rowCount !== result.rows.length - alreadyMigrated) {
        throw new Error(
          `Expected ${result.rows.length - alreadyMigrated} updated rows, got ${updated.rowCount}`,
        );
      }
      await writer.query("COMMIT");
      console.log(
        `Updated ${updated.rowCount} media records after verifying ${verified} R2 objects`,
      );
    } catch (error) {
      await writer.query("ROLLBACK");
      throw error;
    } finally {
      await writer.end();
    }
  } finally {
    if (!dbClosed) await db.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
