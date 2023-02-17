import type { GetStaticPropsContext } from "next";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader, NotLoggedInPage } from ".";
import { api } from "../utils/api";
import { BackButton } from "./components/BackButton";
import { LanguageSelectionButton } from "./components/LanguageSelectionButton";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (!session || !session.user || !session.user.id) {
    return <NotLoggedInPage />;
  } else {
    return <AddWordsPage userId={session.user.id} />;
  }
};

export default Home;

function AddWordsPage({ userId }: { userId: string }) {
  const [count, setCount] = useState<string>("10");
  return (
    <>
      <main className="min-h-screen">
        <div className="top-0 flex h-20 w-full flex-row justify-between p-4 md:h-24 md:px-8 lg:h-28 lg:px-12">
          <LanguageSelectionButton url="/add" />
          <BackButton />
        </div>
        <div className="flex flex-col items-center justify-start gap-4 pt-4 lg:gap-16 lg:pt-8">
          <TitleHeader />
          <form className="flex w-3/4 flex-col items-center justify-center gap-8 p-4 lg:gap-12">
            <WordCountInput count={count} setCount={setCount} />
            <div className="flex justify-around gap-8 py-4 md:gap-12 lg:gap-32">
              <CancelButton />
              <AddButton userId={userId} count={count} />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

function TitleHeader() {
  const t = useTranslations();
  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="mb-8 rounded-2xl border-4 px-4 py-4 text-center text-2xl md:text-4xl lg:py-6 lg:text-5xl">
        {t("Index.AddWordsModal.howMany")}
      </div>
    </div>
  );
}

function CancelButton() {
  const t = useTranslations();
  return (
    <button
      className="w-32 rounded-md border-2 bg-red-900 px-4 py-2 text-lg shadow-xl 
      md:w-48 md:rounded-xl md:py-4 md:text-3xl lg:w-64 lg:rounded-2xl lg:py-6 lg:text-4xl"
      onClick={() => {
        console.log("cancel");
      }}
    >
      {t("Index.AddWordsModal.cancelButton")}
    </button>
  );
}

function AddButton({ userId, count }: { userId: string; count: string }) {
  const { data: user, isLoading } = api.user.getCurrentRank.useQuery({
    userId: userId,
  });
  const t = useTranslations();
  const { mutate: createPracticesFromRank } =
    api.practice.createPracticesFromRank.useMutation();
  if (!user?.currentRankProgress || isLoading) return <Loader />;
  return (
    <button
      className="w-32 rounded-md border-2 bg-green-900 px-4 py-2 text-lg shadow-xl 
      md:w-48 md:rounded-xl md:py-4 md:text-3xl lg:w-64 lg:rounded-2xl lg:py-6 lg:text-4xl"
      onClick={() => {
        createPracticesFromRank({
          userId: userId,
          count: parseInt(count),
          rank: user.currentRankProgress,
        });
        console.log("add");
      }}
    >
      {t("Index.AddWordsModal.addButton")}
    </button>
  );
}

function WordCountInput({
  count,
  setCount,
}: {
  count: string;
  setCount: (value: string) => void;
}) {
  return (
    <input
      type="number"
      value={count}
      onChange={(e) => {
        setCount(e.target.value);
      }}
      min={1}
      max={1000}
      className="w-1/2 rounded-xl border-2 bg-[#121212] px-3 py-1 text-center text-3xl 
      focus:border-white focus:ring md:w-1/4 md:py-4 md:text-4xl lg:border-4 lg:py-6 lg:text-5xl"
    />
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const locale = ctx.locale || "en";
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
