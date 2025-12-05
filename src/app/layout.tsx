

import "../styles/globals.css";
import type { ReactNode } from "react";
import Provider from "./SessionProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "../components/LayoutWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-white text-black" suppressHydrationWarning>
                <Provider>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </Provider>

                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}




