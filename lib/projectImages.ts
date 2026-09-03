// Firestore caps a document at ~1MiB total. Images are stored as base64
// data URIs directly on the project document (no Storage/Blaze plan
// needed), so both the per-image size and the combined total across all
// of a project's images must leave headroom for that limit.
export const MAX_IMAGE_SIZE = 500 * 1024; // raw file bytes, before base64
export const MAX_IMAGES = 10;
const MAX_TOTAL_BASE64_BYTES = 900 * 1024; // leaves ~124KB headroom in the 1MiB doc

export async function fileToDataUri(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export function validateImageFiles(files: File[]): string | null {
  for (const file of files) {
    if (!file.type.startsWith("image/")) return "All files must be images.";
    if (file.size > MAX_IMAGE_SIZE) {
      return `Each image must be smaller than ${Math.round(MAX_IMAGE_SIZE / 1024)}KB.`;
    }
  }
  return null;
}

export function validateTotalSize(existingImages: string[], newImages: string[]): string | null {
  const totalBytes = [...existingImages, ...newImages].reduce((sum, uri) => sum + uri.length, 0);
  if (totalBytes > MAX_TOTAL_BASE64_BYTES) {
    return "These images together are too large for this project. Remove some or use smaller images.";
  }
  return null;
}
