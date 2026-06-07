import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { getAdminUser } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — stays under the serverless body limit

/**
 * Server-side product-image upload. The browser POSTs a single file as
 * multipart form-data; we stream it to Vercel Blob with `put()`.
 *
 * Auth: gated by getAdminUser(), which reads the Auth.js session cookie
 * directly (no middleware needed here). Blob auth uses BLOB_READ_WRITE_TOKEN if
 * set, otherwise the Vercel OIDC token + BLOB_STORE_ID — both read from env.
 *
 * The real file type is detected from magic bytes (not the spoofable client
 * Content-Type), SVG is rejected (script-carrying / stored-XSS vector), and the
 * blob key is server-generated — the client filename never reaches the path.
 */
function sniffImageType(b: Uint8Array): { mime: string; ext: string } | null {
  if (b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { mime: "image/png", ext: "png" };
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return { mime: "image/jpeg", ext: "jpg" };
  if (
    b.length >= 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  )
    return { mime: "image/webp", ext: "webp" };
  if (b.length >= 4 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38)
    return { mime: "image/gif", ext: "gif" };
  return null;
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Image must be under 4MB. Please resize and retry." },
      { status: 413 },
    );
  }

  // Validate by content, not by the client-supplied MIME type.
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const kind = sniffImageType(head);
  if (!kind) {
    return Response.json(
      { error: "Only PNG, JPEG, WebP, or GIF images are allowed." },
      { status: 415 },
    );
  }

  try {
    const blob = await put(`products/${randomUUID()}.${kind.ext}`, file, {
      access: "public",
      contentType: kind.mime,
    });
    return Response.json({ url: blob.url });
  } catch (err) {
    console.error("[upload-image] put failed", err);
    return Response.json(
      { error: "Upload failed. Please try again, or check the file and retry." },
      { status: 500 },
    );
  }
}
