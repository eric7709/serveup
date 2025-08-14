import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Children } from "@/shared/types/children";
import { ClientWrapper } from "@/redux/provider/ClientWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your App",
  description: "Restaurant management app",
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
