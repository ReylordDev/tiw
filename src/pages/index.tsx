import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import MyHead from "./components/myHead";

const Home: NextPage = () => {
  return (
    <>
      <MyHead />
      <div>{t("Index.titleHeader")}</div>
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

function NotLoggedInText() {
  return (
    <div className="px-6 py-4 text-center text-xl lg:px-14 lg:py-8 lg:text-4xl">
      You&apos;re not currently <br></br>logged in.
    </div>
  );
}

function LogInButton() {
  return (
    <button
      className="lg:border-6 rounded-2xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => void signIn()}
    >
      Log in
    </button>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        // what is permanent?
        permanent: false,
        destination: "/menu",
      },
    };
  }

  return { props: {} };
}
