import type { GetStaticPropsContext } from "next";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSelectionButton, Loader, NotLoggedInPage } from ".";
import { api } from "../utils/api";

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
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full justify-between py-4 px-4 pt-8   lg:px-24">
          <LanguageSelectionButton url="/add" />
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <TitleHeader />
          <WordCountInput count={count} setCount={setCount} />
          <div className="flex justify-around py-4">
            <CancelButton />
            <AddButton userId={userId} count={count} />
          </div>
          <div className="my-4"></div>
          <div></div>
        </div>
      </main>
    </>
  );
}

function TitleHeader() {
  const t = useTranslations();
  return (
    <div className="px-8">
      <div className="mb-8 rounded-2xl border-4 px-4 py-4 text-center text-2xl md:text-4xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
        {t("Index.AddWordsModal.howMany")}
      </div>
    </div>
  );
}

function CancelButton() {
  const t = useTranslations();
  return (
    <button
      className="rounded-md bg-[#121212] px-4 py-2"
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
      className="rounded-md bg-[#121212] px-4 py-2"
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
      className="w-1/2 border-4 bg-[#121212] px-1 text-center shadow-sm focus:border-red-300 focus:ring"
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
