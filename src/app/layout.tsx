// import "../styles/globals.css";
// import type { ReactNode } from "react";
// import SessionProviderWrapper from "@/components/SessionProviderWrapper";

// import { NextIntlClientProvider } from "next-intl";
// import { useMessages, useLocale } from "next-intl";

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const locale = useLocale();
//   const messages = useMessages();

//   return (
//     <html lang={locale}>
//       <body className="bg-[#060E25] text-white">
//         <NextIntlClientProvider locale={locale} messages={messages}>
//           <SessionProviderWrapper>
//             {children}
//           </SessionProviderWrapper>
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }

import "../styles/globals.css";
import type { ReactNode } from "react";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-[#060E25] text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProviderWrapper>
            {children}
          </SessionProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

