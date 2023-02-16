import type { Practice, Word } from "@prisma/client";
import type { GetStaticPropsContext } from "next";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loader, NotLoggedInPage } from ".";
import { completePractice } from "../server/revisionCalculations";
import { api } from "../utils/api";
import MyHead from "./components/myHead";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (!session || !session.user || !session.user.id) {
    return <NotLoggedInPage />;
  } else {
    return <RevisionPage userId={session.user.id} />;
  }
};

export default Home;

function RevisionPage({ userId }: { userId: string }) {
  const [revision, setRevision] = useState<
    (Practice & {
      word: Word;
    })[]
  >();
  const t = useTranslations();
  const [wordIndex, setWordIndex] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const { mutate: updatePractice } = api.practice.updatePractice.useMutation();
  const { data: practices, isLoading } =
    api.practice.getDuePracticesByUserId.useQuery(
      { userId: userId },
      {
        onSuccess: (data) => {
          setRevision(data);
        },
        refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
        // refetchInterval: false,
      }
    );
  if (isLoading) {
    return <Loader />;
  }
  if (!practices || !revision) {
    console.log(practices);
    return <Loader />;
  }
  if (revision.length === 0 && !finished) {
    setFinished(true);
  }

  function handleSolutionToggle() {
    console.log("Solution", solutionVisible ? "hidden" : "visible");
    setSolutionVisible(!solutionVisible);
  }

  function handleSubmit(correct: boolean) {
    if (!revision || revision.length === 0) {
      console.log("No revision");
      return;
    }
    const practice = revision[wordIndex];
    if (!practice) {
      console.log("No practice");
      return;
    }
    const { newCounter, nextPracticeDate } = completePractice(
      correct,
      practice
    );
    updatePractice({
      practiceId: practice.id,
      nextPractice: nextPracticeDate,
      newCounter,
    });
    if (wordIndex < revision.length - 1) {
      setSolutionVisible(false);
      setWordIndex(wordIndex + 1);
    } else {
      setFinished(true);
    }
  }

  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col items-center justify-between">
        {finished && (
          <>
            <div></div>
            <div className="rounded-3xl border-b-4 px-6 py-4 text-center text-4xl lg:rounded-[36px] lg:border-4 lg:px-20 lg:py-8 lg:text-7xl">
              {t("Revision.doneText")}
            </div>
            <p className="px-6 py-4 text-center text-2xl lg:px-20 lg:py-8 lg:text-4xl">
              {t("Revision.comeBackTomorrow1")}
              <br></br>
              {t("Revision.comeBackTomorrow2")}
            </p>
            <p className="px-6 pt-20 text-center text-xl lg:px-20 lg:py-8 lg:text-3xl">
              {t("Revision.checkProgress")}
            </p>
            <Link
              href="/progress"
              className="rounded-3xl border-2 px-4 py-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
            >
              {t("Index.progressButton")}
            </Link>
            <p className="px-6 pt-20 text-center text-xl lg:px-20 lg:py-8 lg:text-3xl">
              {t("Revision.returnToMenu")}
            </p>
            <Link
              href="/"
              className="rounded-3xl border-2 px-4 py-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
            >
              {t("Revision.back")}
            </Link>
            <div></div>
          </>
        )}
        {!finished && (
          <>
            <div className="flex w-full justify-between py-4 px-4 pt-8 lg:px-24  lg:pt-24">
              <LanguageSelectionButton />
              <RemainingWordsDisplay
                length={revision.length}
                index={wordIndex + 1}
              />
            </div>
            <CurrentWordDisplay
              word={revision[wordIndex]?.word}
              solutionVisible={solutionVisible}
            />
            <div className="flex w-full flex-col justify-around gap-8 py-4 px-4 pt-8 lg:flex-row lg:px-24 lg:pt-24">
              {solutionVisible && <CorrectButton handleSubmit={handleSubmit} />}
              {solutionVisible && (
                <IncorrectButton handleSubmit={handleSubmit} />
              )}
            </div>
            <ShowSolutionToggle
              solutionVisible={solutionVisible}
              handleSolutionToggle={handleSolutionToggle}
            />
            <ProgressLink />
          </>
        )}
      </main>
    </>
  );
}

function LanguageSelectionButton() {
  const t = useTranslations();
  const { locale } = useRouter();
  const localeValue = locale === "en" ? "de" : "en";
  return (
    <Link
      className="flex flex-row items-center gap-4 rounded-2xl border-2 p-2 text-2xl lg:p-4 lg:text-4xl"
      href="/revision"
      locale={localeValue}
    >
      <Image
        src={"../globe.svg"}
        height={32}
        width={32}
        alt="Globe for language selection"
      />
      {t("Index.languageSelectionButton")}
    </Link>
  );
}

function RemainingWordsDisplay({
  length,
  index,
}: {
  length: number;
  index: number;
}) {
  return (
    <div className="rounded-2xl border-2 p-2 text-2xl lg:p-4 lg:text-4xl">
      {index}/{length}
    </div>
  );
}

function CurrentWordDisplay({
  word,
  solutionVisible,
}: {
  word: Word | undefined;
  solutionVisible: boolean;
}) {
  const { locale } = useRouter();
  if (!word) {
    return (
      <div className="lg:border-7 rounded-3xl border-4 px-6 py-4 text-5xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl"></div>
    );
  }
  return (
    <div className="lg:border-7 rounded-3xl border-4 px-6 py-4 text-5xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
      {solutionVisible &&
        ((locale === "en" && word.english) || (locale === "de" && word.german))}
      {!solutionVisible && word.italian}
    </div>
  );
}

function ShowSolutionToggle({
  solutionVisible,
  handleSolutionToggle,
}: {
  solutionVisible: boolean;
  handleSolutionToggle: () => void;
}) {
  const t = useTranslations();
  return (
    <button
      className="lg:border-6 rounded-3xl border-4 px-6 py-4 text-3xl lg:px-14 lg:py-8 lg:text-4xl"
      onClick={() => handleSolutionToggle()}
    >
      {solutionVisible && t("Revision.hideSolution")}
      {!solutionVisible && t("Revision.showSolution")}
    </button>
  );
}

function ProgressLink() {
  const t = useTranslations();
  return (
    <Link
      href={"/progress"}
      className="lg:border-b-6 mb-8 rounded-sm border-b-2 px-1 py-1 text-2xl md:mt-4 md:border-b-4 md:text-3xl lg:px-3"
    >
      {t("Index.progressButton")}
    </Link>
  );
}

function CorrectButton({
  handleSubmit,
}: {
  handleSubmit: (correct: boolean) => void;
}) {
  const t = useTranslations();
  return (
    <button
      className="rounded-2xl border-2 bg-green-900 px-7 py-2 text-2xl md:mx-16 md:border-4 lg:py-8 lg:px-12 lg:text-4xl"
      onClick={() => handleSubmit(true)}
    >
      {t("Revision.correct")}
    </button>
  );
}

function IncorrectButton({
  handleSubmit,
}: {
  handleSubmit: (correct: boolean) => void;
}) {
  const t = useTranslations();
  return (
    <button
      className="rounded-2xl border-2 bg-red-900 px-7 py-2 text-2xl md:mx-16 md:border-4 md:text-3xl lg:py-8 lg:px-12 lg:text-4xl"
      onClick={() => handleSubmit(false)}
    >
      {t("Revision.incorrect")}
    </button>
  );
}

// consider server side rendering this file
export async function getStaticProps(ctx: GetStaticPropsContext) {
  const locale = ctx.locale || "en";
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
