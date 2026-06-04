import { put } from "@vercel/blob";
import { getAdminUser } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — stays under the serverless body limit

/**
 * Server-side product-image upload. The browser POSTs a single file as
 * multipart form-data; we stream it to Vercel Blob with `put()`.
 *
 * Auth: gated by getAdminUser() (Clerk middleware runs on /api/* so the
 * session is available here). Blob auth uses BLOB_READ_WRITE_TOKEN if set,
 * otherwise the Vercel OIDC token + BLOB_STORE_ID — both read from env.
 */
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
  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Only image files are allowed." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Image must be under 4MB. Please resize and retry." },
      { status: 413 },
    );
  }

  try {
    const blob = await put(`products/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
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
