import { Button, type ButtonSize } from "@/components/atoms/Button";

export interface WhatsAppCTAProps {
  phone: string;
  message?: string;
  label?: string;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function WhatsAppCTA({
  phone,
  message,
  label = "WhatsApp",
  size = "md",
  fullWidth,
  className,
}: WhatsAppCTAProps) {
  const cleanedPhone = phone.replace(/\s|-|\(|\)/g, "");
  const url = `https://wa.me/${cleanedPhone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
  return (
    <Button
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variant="whatsapp"
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      {label}
    </Button>
  );
}
