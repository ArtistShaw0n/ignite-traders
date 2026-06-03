import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface AdminNotificationProps {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  quantity?: number | null;
  source?: string | null;
  inquiryId: string;
  productTitle?: string | null;
  siteUrl: string;
}

export function AdminNotificationEmail({
  name,
  company,
  email,
  phone,
  message,
  quantity,
  source,
  inquiryId,
  productTitle,
  siteUrl,
}: AdminNotificationProps) {
  const subjectLine = productTitle
    ? `New quote request: ${productTitle}`
    : "New inquiry on IGNITE Traders";

  return (
    <Html>
      <Head />
      <Preview>{`${subjectLine} — from ${name}${company ? `, ${company}` : ""}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>📨 New IGNITE Inquiry</Heading>
          <Text style={subtitle}>
            {productTitle ? `Quote request for ${productTitle}` : "General inquiry"}
            {source ? ` · via ${source}` : ""}
          </Text>

          <Section style={card}>
            <Row label="Name" value={name} />
            {company ? <Row label="Company" value={company} /> : null}
            <Row
              label="Email"
              value={<Link href={`mailto:${email}`} style={link}>{email}</Link>}
            />
            {phone ? (
              <Row
                label="Phone"
                value={<Link href={`tel:${phone}`} style={link}>{phone}</Link>}
              />
            ) : null}
            {quantity ? <Row label="Quantity" value={String(quantity)} /> : null}
          </Section>

          <Section style={messageBox}>
            <Text style={messageLabel}>MESSAGE</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={meta}>
            Inquiry ID: <code style={code}>{inquiryId}</code>
          </Text>
          <Text style={meta}>
            Reply directly to this email to reach {name}. (Once the admin
            dashboard ships in Phase 5, you'll be able to mark status here:{" "}
            <Link href={`${siteUrl}/admin/inquiries/${inquiryId}`} style={link}>
              open
            </Link>
            .)
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Text style={row}>
      <strong style={rowLabel}>{label}:</strong> {value}
    </Text>
  );
}

// ---- styles (inline — email clients ignore CSS files) ----
const body = {
  backgroundColor: "#f5f5f4",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};
const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};
const h1 = {
  color: "#0c0a09",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 4px",
};
const subtitle = {
  color: "#78716c",
  fontSize: "14px",
  margin: "0 0 24px",
};
const card = {
  backgroundColor: "#fafaf9",
  borderRadius: "6px",
  margin: "0 0 20px",
  padding: "16px 20px",
};
const row = {
  color: "#27272a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
};
const rowLabel = {
  color: "#0c0a09",
  display: "inline-block",
  minWidth: "76px",
};
const messageBox = {
  borderLeft: "3px solid #ea580c",
  paddingLeft: "16px",
  margin: "0 0 20px",
};
const messageLabel = {
  color: "#78716c",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 4px",
};
const messageText = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};
const hr = {
  borderColor: "#e7e5e4",
  borderStyle: "solid",
  borderWidth: "1px 0 0",
  margin: "24px 0 16px",
};
const meta = {
  color: "#78716c",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "4px 0",
};
const code = {
  backgroundColor: "#f5f5f4",
  borderRadius: "3px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "11px",
  padding: "2px 6px",
};
const link = {
  color: "#ea580c",
  textDecoration: "underline",
};
