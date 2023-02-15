import type { Practice, Word } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { completePractice } from "../server/revisionCalculations";
import { api } from "../utils/api";
import MyHead from "./components/myHead";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session?.user) {
    return null;
  }

  return (
    <>
      <MyHead />
      <Revision userId={session.user.id} />
    </>
  );
};

export default Home;

function Revision({ userId }: { userId: string }) {
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
    return <div>Loading...</div>;
  }
  if (!practices || !revision) {
    console.log(practices);
    return <div>Loading...</div>;
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
    <main className="flex min-h-screen flex-col items-center justify-between">
      {finished && (
        <>
          <div></div>
          <div className="lg:border-7 rounded-3xl border-b-4 px-6 py-4 text-5xl lg:rounded-[36px] lg:px-20 lg:py-8 lg:text-7xl">
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
            className="rounded-2xl border-4 px-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
          >
            {t("Menu.progressButton")}
          </Link>
          <p className="px-6 pt-20 text-center text-xl lg:px-20 lg:py-8 lg:text-3xl">
            {t("Revision.returnToMenu")}
          </p>
          <Link
            href="menu"
            className="rounded-2xl border-4 px-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
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
            {solutionVisible && <IncorrectButton handleSubmit={handleSubmit} />}
          </div>
          <ShowSolutionToggle
            solutionVisible={solutionVisible}
            handleSolutionToggle={handleSolutionToggle}
          />
          <div className="flex w-full items-center justify-center py-4 px-4 lg:justify-between lg:pb-12">
            <div className="lg:w-32"></div>
            <ProgressLink />
            <RemainingWordsDisplayLarge
              length={revision.length}
              index={wordIndex + 1}
            />
          </div>
        </>
      )}
    </main>
  );
}

function LanguageSelectionButton() {
  return (
    <div className="invisible">
      <Image
        src={"globe.svg"}
        height={48}
        width={48}
        alt="Globe for language selection"
      />
    </div>
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
    <div className="rounded-2xl border-4 px-4 py-2 text-2xl  lg:hidden">
      {index}/{length}
    </div>
  );
}

function RemainingWordsDisplayLarge({
  length,
  index,
}: {
  length: number;
  index: number;
}) {
  return (
    <div className="invisible w-0 rounded-2xl text-4xl lg:visible lg:w-auto lg:border-4 lg:px-6 lg:py-3">
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
      className="lg:border-b-6 rounded-sm border-b-4 px-1  py-1 text-4xl lg:px-3  lg:text-3xl "
    >
      {t("Menu.progressButton")}
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
      className="rounded-2xl border-2 bg-green-900 px-7 py-2 text-2xl"
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
      className="rounded-2xl border-2 bg-red-900 px-4 py-2 text-2xl"
      onClick={() => handleSubmit(false)}
    >
      {t("Revision.incorrect")}
    </button>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const locale = ctx.locale || "en";
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
