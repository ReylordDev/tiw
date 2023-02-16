import type { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddWordsModal from "./components/AddWordsModal";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { NotLoggedInPage } from ".";

function MenuPage() {
  const { data: session } = useSession();
  console.log("session", session);
  if (!session || !session.user || !session.user.id) {
    return <NotLoggedInPage />;
  } else {
    return <MenuPageLoggedIn userId={session.user.id} />;
  }
}

export default MenuPage;

function MenuPageLoggedIn({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {modalOpen && <AddWordsModal setModal={setModalOpen} userId={userId} />}
      <div className="flex w-full justify-between py-4 px-4 pt-8   lg:px-24">
        <LanguageSelectionButton />
        <SignOutButton />
      </div>
      <TitleHeader />
      <div className="my-4"></div>
      <PracticeButton />
      <AddWordsButton setModal={setModalOpen} />
      <ProgressButton />
      <div className="my-4"></div>
      <div></div>
    </main>
  );
}

function LanguageSelectionButton() {
  const t = useTranslations();
  const { locale } = useRouter();
  const localeValue = locale === "en" ? "de" : "en";
  return (
    <Link
      className="flex flex-row items-center gap-4 text-2xl lg:text-4xl"
      href="menu"
      locale={localeValue}
    >
      <Image
        src={"../globe.svg"}
        height={48}
        width={48}
        alt="Globe for language selection"
      />
      {t("Menu.languageSelectionButton")}
    </Link>
  );
}

function SignOutButton() {
  const t = useTranslations();
  return (
    <button className="text-2xl lg:text-4xl" onClick={() => void signOut()}>
      {t("Menu.signOutButton")}
    </button>
  );
}

function TitleHeader() {
  const t = useTranslations();
  return (
    <div className="lg:border-7 rounded-2xl border-4 px-6 py-4 text-2xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
      {t("Index.titleHeader")}
    </div>
  );
}

function PracticeButton() {
  const t = useTranslations();
  return (
    <Link
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      href={"revision"}
    >
      {t("Menu.practiceButton")}
    </Link>
  );
}

function AddWordsButton(props: { setModal: (open: boolean) => void }) {
  const t = useTranslations();
  return (
    <button
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => {
        props.setModal(true);
      }}
    >
      {t("Menu.addWordsButton")}
    </button>
  );
}

function ProgressButton() {
  const t = useTranslations();
  return (
    <Link
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      href={"progress"}
    >
      {t("Menu.progressButton")}
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
