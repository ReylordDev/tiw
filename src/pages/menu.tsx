import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import AddWordsModal from "./components/AddWordsModal";
import { getServerAuthSession } from "../server/auth";
import { signOut } from "next-auth/react";
import MyHead from "./components/myHead";

function MenuPage({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: user } = api.user.getById.useQuery({ id: userId });
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
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
          <button
            className="text-2xl lg:text-4xl"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
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
  return (
    <div className="">
      <Image
        src={"globe.svg"}
        height={48}
        width={48}
        alt="Globe for language selection"
      />
    </div>
  );
}

function TitleHeader() {
  return (
    <div className="lg:border-7 rounded-2xl border-4 px-6 py-4 text-2xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
      Top 1000 Italian Words
    </div>
  );
}

function PracticeButton() {
  return (
    <Link
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      href={"revision"}
    >
      Practice
    </Link>
  );
}

function AddWordsButton(props: { setModal: (open: boolean) => void }) {
  return (
    <button
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => {
        props.setModal(true);
      }}
    >
      Add more words
    </button>
  );
}

function ProgressButton() {
  return (
    <Link
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      href={"progress"}
    >
      Progress
    </Link>
  );
}

// todo: remove server side rendering
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

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
    },
  };
}
