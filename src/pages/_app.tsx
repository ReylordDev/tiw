import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/react";

import "../styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{
  session: Session | null;
  messages: AbstractIntlMessages;
}> = ({ Component, pageProps }) => {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>Top Italian Words</title>
          <meta
            name="description"
            content="Learn the 1000 most common italian words with a spaced repetition algorithm."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <Analytics />
      </SessionProvider>
    </NextIntlProvider>
  );
};

export default api.withTRPC(MyApp);
