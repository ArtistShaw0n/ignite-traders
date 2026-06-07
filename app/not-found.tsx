import { Button } from "@/components/atoms/Button";
import { Footer, Header } from "@/components/organisms";
import { SITE_PHONE, SITE_WHATSAPP } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Header phone={SITE_PHONE} whatsapp={SITE_WHATSAPP} />
      <main className="flex-1 flex items-center justify-center section-pad">
        <div className="container-site">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <p className="text-[8rem] sm:text-[10rem] font-black leading-none text-brand-500 tracking-tight">
              404
            </p>
            <h1 className="text-h1 text-[var(--fg-primary)] tracking-tight">Page not found</h1>
            <p className="text-body-lg text-[var(--fg-secondary)]">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
              you back on track.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Button href="/" variant="primary" size="md">
                Back to Home
              </Button>
              <Button href="/products" variant="secondary" size="md">
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
