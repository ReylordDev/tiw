import type { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSelectionButton from "../components/LanguageSelectionButton";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const { status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (status === "unauthenticated") {
    return <NotLoggedInPage />;
  }
  return <MenuPageLoggedIn />;
};

export default Home;

export function NotLoggedInPage() {
  const { locale } = useRouter();
  if (!locale) {
    return <Loader />;
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full justify-between py-4 px-4 pt-8 lg:px-24">
          <LanguageSelectionButton url="/" locale={locale} />
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
      className="rounded-2xl border-2 px-6 py-4 text-3xl lg:border-4 lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => void signIn()}
    >
      {t("logInButton")}
    </button>
  );
}

export function Loader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Image src="/rings.svg" alt="Loading" width={100} height={100}></Image>
    </div>
  );
}

function MenuPageLoggedIn() {
  const { locale } = useRouter();
  if (!locale) {
    return <Loader />;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full justify-between py-4 px-4 pt-8   lg:px-24">
          <LanguageSelectionButton url="/" locale={locale} />
          <SignOutButton />
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <TitleHeader />
          <PracticeButton />
          <AddWordsButton />
          <ProgressButton />
        </div>
        <div className="my-4"></div>
        <div></div>
      </main>
    </>
  );
}

function SignOutButton() {
  const t = useTranslations();
  return (
    <button
      className="rounded-2xl border-2 px-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
      onClick={() => void signOut()}
    >
      {t("Index.signOutButton")}
    </button>
  );
}

function TitleHeader() {
  const t = useTranslations();
  return (
    <div className="px-8">
      <div className="mb-8 rounded-2xl border-4 px-4 py-4 text-center text-2xl md:text-4xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
        {t("Index.titleHeader")}
      </div>
    </div>
  );
}

function PracticeButton() {
  const t = useTranslations();
  const [revisionCount, setRevisionCount] = useState(0);
  api.practice.getDuePracticesCountWithWordsFromContext.useQuery(
    undefined, // no input
    {
      onSuccess(data) {
        setRevisionCount(data);
      },
    }
  );
  return (
    <div className="flex flex-row rounded-2xl border-2 px-6 py-4 text-3xl lg:border-4 lg:px-14 lg:py-8 lg:text-4xl">
      <Link className="" href={"revision"}>
        {t("Index.practiceButton")}
        {revisionCount > 0 ? " (" + revisionCount.toString() + ")" : ""}
      </Link>
    </div>
  );
}

function AddWordsButton() {
  const t = useTranslations();
  return (
    <Link
      href={"/add"}
      className="mx-16 rounded-2xl border-2 px-6 py-4 text-3xl lg:w-auto lg:border-4 lg:px-14 lg:py-8 lg:text-4xl"
    >
      {t("Index.addWordsButton")}
    </Link>
  );
}

function ProgressButton() {
  const t = useTranslations();
  return (
    <Link
      className="rounded-2xl border-2 px-6 py-4 text-3xl lg:border-4 lg:px-14 lg:py-8 lg:text-4xl"
      href={"progress"}
    >
      {t("Index.progressButton")}
    </Link>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const locale = ctx.locale ?? "en";

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
