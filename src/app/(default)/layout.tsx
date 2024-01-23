import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import { AxiomWebVitals } from "next-axiom";
import { ToastContainer, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { AuthModalTrigger } from "@/features/auth";
import { NextAuthProvider } from "@/utils/next-auth-provider";
import { ReactQueryProvider } from "@/utils/react-query-provider";
import WagmiProvider from "@/utils/wagmi-provider";

import styles from "./styles/toast.module.scss";

import "./styles/layout.scss";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nextCookies = cookies();
  const theme = nextCookies.get("theme");
  const color = nextCookies.get("color");
  const fontSize = nextCookies.get("font-size");

  return (
    <html
      className={`${theme?.value ?? ""} ${color?.value ?? ""} ${
        fontSize?.value ?? ""
      }`}
      lang="en"
    >
      <body suppressHydrationWarning={true}>
        <WagmiProvider>
          <NextAuthProvider>
            <ReactQueryProvider>
              <div className="layout">
                <main>{children}</main>

                <ToastContainer
                  position="bottom-left"
                  autoClose={2000}
                  hideProgressBar={true}
                  transition={Slide}
                  closeButton={false}
                  closeOnClick={true}
                  className={styles.container}
                  toastClassName={styles.toast}
                  role="alert"
                />

                <AuthModalTrigger />
              </div>
            </ReactQueryProvider>
          </NextAuthProvider>
        </WagmiProvider>
        <Analytics />
        <AxiomWebVitals />
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    default: "Cascadia",
    template: "%s / Cascadia",
    absolute: "Cascadia",
  },

  description: "Cascadia is a social media platform for sharing your thoughts.",

  icons: {
    icon: "/cascadia-logo.png",
  },
};
