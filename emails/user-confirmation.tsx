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

export interface UserConfirmationProps {
  name: string;
  message: string;
  productTitle?: string | null;
  inquiryId: string;
  whatsappLink: string;
  siteUrl: string;
}

export function UserConfirmationEmail({
  name,
  message,
  productTitle,
  inquiryId,
  whatsappLink,
  siteUrl,
}: UserConfirmationProps) {
  const subject = productTitle
    ? `We got your inquiry about ${productTitle} — IGNITE Traders`
    : "We got your inquiry — IGNITE Traders";

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Thanks for reaching out, {name}.</Heading>
          <Text style={lede}>
            We've received your inquiry and our procurement team will get back
            to you within <strong>24 hours on business days</strong>.
          </Text>

          {productTitle ? (
            <Text style={lede}>
              Specifically about: <strong>{productTitle}</strong>.
            </Text>
          ) : null}

          <Section style={card}>
            <Text style={messageLabel}>YOUR MESSAGE</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Heading as="h2" style={h2}>
            Need a faster reply?
          </Heading>
          <Text style={p}>
            For urgent orders or quick clarifications, message us on WhatsApp:{" "}
            <Link href={whatsappLink} style={link}>
              chat with IGNITE
            </Link>
            . We typically respond within a few hours.
          </Text>

          <Hr style={hr} />

          <Text style={meta}>
            Reference ID: <code style={code}>{inquiryId}</code>
          </Text>
          <Text style={meta}>
            This is an automated confirmation — please don't reply to this
            address. To respond, you'll receive a follow-up from our team
            shortly.
          </Text>
          <Text style={meta}>
            IGNITE Traders · 6/1 South Kallyanpur, Mirpur Road, Dhaka ·{" "}
            <Link href={siteUrl} style={link}>
              ignitetradersbd.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "32px",
  margin: "0 0 12px",
};
const h2 = {
  color: "#0c0a09",
  fontSize: "16px",
  fontWeight: 700,
  margin: "24px 0 8px",
};
const lede = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 12px",
};
const p = {
  color: "#27272a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px",
};
const card = {
  backgroundColor: "#fafaf9",
  borderLeft: "3px solid #ea580c",
  borderRadius: "0 6px 6px 0",
  margin: "20px 0",
  padding: "16px 20px",
};
const messageLabel = {
  color: "#78716c",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 6px",
};
const messageText = {
  color: "#27272a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};
const hr = {
  borderColor: "#e7e5e4",
  borderStyle: "solid",
  borderWidth: "1px 0 0",
  margin: "28px 0 16px",
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
