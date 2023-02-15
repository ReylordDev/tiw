import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlProvider } from "next-intl";

import "../styles/globals.css";

const MyApp: AppType<{
  session: Session | null;
  messages: AbstractIntlMessages;
}> = ({ Component, pageProps }) => {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </NextIntlProvider>
  );
};

export default api.withTRPC(MyApp);
