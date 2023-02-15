import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import AddWordsModal from "./components/AddWordsModal";
import { getServerAuthSession } from "../server/auth";
import { signOut } from "next-auth/react";
import MyHead from "./components/myHead";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

function MenuPage({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: user } = api.user.getById.useQuery({ id: userId });
  if (!user) return null;
  console.log(user);

  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col items-center justify-between">
        {modalOpen && (
          <AddWordsModal setModal={setModalOpen} userId={user?.id} />
        )}
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
    </>
  );
}

export default MenuPage;

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

// todo: remove server side rendering
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const locale = ctx.locale || "en";

  if (!session?.user?.id) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      userId: session.user.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
