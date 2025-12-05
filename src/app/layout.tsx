
import "../styles/globals.css";
import type { ReactNode } from "react";
import Provider from "./SessionProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "../components/LayoutWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-white text-black">
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





