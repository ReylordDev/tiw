import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import MyHead from "./components/myHead";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full justify-between py-4 px-4 pt-8 lg:px-24  lg:pt-24">
          <LanguageSelectionButton />
        </div>
        <TitleHeader />
        <div className="my-4"></div>
        <NotLoggedInText />
        <LogInButton />
        <div className="my-4"></div>
        <div></div>
      </main>
    </>
  );
};

export default Home;

function LanguageSelectionButton() {
  const t = useTranslations();
  const { locale } = useRouter();
  const localeValue = locale === "en" ? "de" : "en";
  return (
    <Link
      className="flex flex-row items-center gap-4 text-2xl lg:text-4xl"
      href="/"
      locale={localeValue}
    >
      <Image
        src={"globe.svg"}
        height={48}
        width={48}
        alt="Globe for language selection"
      />
      {t("Menu.languageSelectionButton")}
    </Link>
  );
}

function TitleHeader() {
  const t = useTranslations("Index");
  return (
    <div className="lg:border-7 rounded-2xl border-4 px-6 py-4 text-2xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
      {t("titleHeader")}
    </div>
  );
}

function NotLoggedInText() {
  const t = useTranslations("Index");
  return (
    <div className="px-6 py-4 text-center text-xl lg:px-14 lg:py-8 lg:text-4xl">
      {t("notLoggedInText1")}
      <br></br>
      {t("notLoggedInText2")}
    </div>
  );
}

function LogInButton() {
  const t = useTranslations("Index");
  return (
    <button
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => void signIn()}
    >
      {t("logInButton")}
    </button>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const locale = ctx.locale || "en";

  if (session?.user) {
    return {
      redirect: {
        // what is permanent?
        permanent: false,
        destination: "/menu",
      },
    };
  }

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
