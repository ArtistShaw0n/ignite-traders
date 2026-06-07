import { z } from "zod";

/**
 * Validation for inquiry/contact-form submissions.
 *
 * Shared between the client (form-level error display) and the server
 * action (authoritative check). Always validate on the server — the
 * client check is a UX nicety only.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  company: z.string().trim().max(150, "Company name is too long").optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().trim().max(30, "Phone is too long").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters about what you need")
    .max(2000, "Message is too long (2000 char max)"),
  productId: z.string().uuid().optional().or(z.literal("")),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0").optional(),
  source: z
    .enum(["home-hero", "contact-page", "product-page", "whatsapp-fallback"])
    .default("contact-page"),
  // Honeypot — bots fill this; humans never see it.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
