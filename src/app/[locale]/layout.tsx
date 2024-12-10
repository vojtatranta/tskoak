import { auth } from "@/auth";
import Providers from "@/web/components/layout/providers";
import { Toaster } from "@/web/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import NextTopLoader from "nextjs-toploader";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Lato } from "next/font/google";
import "../globals.css";
import { getMetaTags } from "@/components/get-metatags";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

async function loadLocale(locale: string) {
  // Dynamically import the locale
  try {
    const localeModule = await import(`date-fns/locale/${locale}/index.js`);
    return localeModule.default;
  } catch (error) {
    console.error(`Error loading locale ${locale}:`, error);
    return null; // Fallback to default behavior
  }
}

export const generateMetadata = getMetaTags();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [session, messages] = await Promise.all([auth(), getMessages()]);

  setRequestLocale(params.locale);

  return (
    <html
      lang={params.locale}
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <body className={"overflow-hidden"}>
        <NextIntlClientProvider messages={messages}>
          <NextTopLoader showSpinner={false} />
          <Providers locale={params.locale} session={session}>
            <Toaster />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
