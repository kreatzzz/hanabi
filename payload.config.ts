import { postgresAdapter } from "@payloadcms/db-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Authors } from "./payload/collections/Authors";
import { Categories } from "./payload/collections/Categories";
import { Media } from "./payload/collections/Media";
import { Posts } from "./payload/collections/Posts";
import { Users } from "./payload/collections/Users";
import { SITE_URL } from "./lib/site-url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const payloadDatabaseUrl =
  process.env.PAYLOAD_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  "";

const mediaBaseUrl = process.env.PAYLOAD_MEDIA_BASE_URL?.replace(/\/$/, "");
const r2Config = {
  bucket: process.env.PAYLOAD_R2_BUCKET,
  accessKeyId: process.env.PAYLOAD_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.PAYLOAD_R2_SECRET_ACCESS_KEY,
  endpoint: process.env.PAYLOAD_R2_ENDPOINT,
};
const r2Enabled = Boolean(
  mediaBaseUrl &&
  r2Config.bucket &&
  r2Config.accessKeyId &&
  r2Config.secretAccessKey &&
  r2Config.endpoint,
);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: projectRoot,
    },
    meta: {
      titleSuffix: " | Hanabi CMS",
    },
  },
  routes: {
    admin: "/cms",
    api: "/cms-api",
  },
  serverURL: SITE_URL,
  cors: [SITE_URL],
  csrf: [SITE_URL],
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true;
        const secret = process.env.PAYLOAD_CRON_SECRET;
        return Boolean(
          secret && req.headers.get("authorization") === `Bearer ${secret}`,
        );
      },
    },
  },
  collections: [Users, Media, Authors, Categories, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(projectRoot, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: payloadDatabaseUrl,
    },
    schemaName: "payload",
    migrationDir: path.resolve(projectRoot, "payload-migrations"),
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["posts"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => doc.title ?? "Hanabi Blog",
      generateDescription: ({ doc }) => doc.excerpt ?? "",
      generateImage: ({ doc }) => doc.heroImage,
      generateURL: ({ doc }) => `${SITE_URL}/blog/${doc.slug ?? ""}`,
    }),
    s3Storage({
      enabled: r2Enabled,
      alwaysInsertFields: true,
      bucket: r2Config.bucket ?? "payload-blog-media",
      clientUploads: r2Enabled,
      collections: {
        media: {
          prefix: "blog",
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = [prefix, filename].filter(Boolean).join("/");
            return `${mediaBaseUrl}/${key}`;
          },
        },
      },
      config: {
        credentials: {
          accessKeyId: r2Config.accessKeyId ?? "",
          secretAccessKey: r2Config.secretAccessKey ?? "",
        },
        endpoint: r2Config.endpoint,
        forcePathStyle: true,
        region: "auto",
      },
    }),
  ],
});
