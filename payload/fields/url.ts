import type { TextFieldSingleValidation } from "payload";

function validate(value: unknown, required: boolean) {
  if (!value) return required ? "Enter a URL." : true;
  if (typeof value !== "string") return "Enter a valid URL.";

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? true
      : "Use an http:// or https:// URL.";
  } catch {
    return "Enter a complete URL beginning with https://";
  }
}

export const validateUrl: TextFieldSingleValidation = (value) =>
  validate(value, false);

export const validateRequiredUrl: TextFieldSingleValidation = (value) =>
  validate(value, true);
