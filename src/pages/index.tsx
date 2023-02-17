import type { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddWordsModal from "./components/AddWordsModal";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import MyHead from "./components/myHead";
import { LanguageSelectionButton } from "./components/LanguageSelectionButton";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (!session || !session.user || !session.user.id) {
    return <NotLoggedInPage />;
  } else {
    return <MenuPageLoggedIn userId={session.user.id} />;
  }
};

export default Home;

export function NotLoggedInPage() {
  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full justify-between py-4 px-4 pt-8 lg:px-24">
          <LanguageSelectionButton url="/" />
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
      className="lg:border-6 rounded-2xl border-2 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
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

function MenuPageLoggedIn({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col items-center justify-between">
        {modalOpen && <AddWordsModal setModal={setModalOpen} userId={userId} />}
        <div className="flex w-full justify-between py-4 px-4 pt-8   lg:px-24">
          <LanguageSelectionButton url="/" />
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
  return (
    <Link
      className="lg:border-6 rounded-2xl border-2 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      href={"revision"}
    >
      {t("Index.practiceButton")}
    </Link>
  );
}

function AddWordsButton() {
  const t = useTranslations();
  return (
    <Link
      href={"/add"}
      className="lg:border-6 mx-16 rounded-2xl border-2 px-6 py-4 text-3xl lg:w-auto lg:px-14 lg:py-8 lg:text-4xl"
    >
      {t("Index.addWordsButton")}
    </Link>
  );
}

function ProgressButton() {
  const t = useTranslations();
  return (
    <Link
      className="lg:border-6 rounded-2xl border-2 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
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
