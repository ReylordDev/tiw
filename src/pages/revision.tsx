import type { Word } from "@prisma/client";
import type { GetStaticPropsContext } from "next";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Loader, NotLoggedInPage } from ".";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import LanguageSelectionButton from "../components/LanguageSelectionButton";

const Home: NextPage = () => {
  const { status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (status === "unauthenticated") {
    return <NotLoggedInPage />;
  } else {
    return <RevisionPage />;
  }
};

export default Home;

type Revision = RouterOutputs["practice"]["getDuePracticesByContextShuffled"];
type PracticeWithWord =
  RouterOutputs["practice"]["getDuePracticesByContextShuffled"][0];

function RevisionPage() {
  const t = useTranslations();
  const { locale } = useRouter();

  const [revision, setRevision] = useState<Revision>();
  const [wordIndex, setWordIndex] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [finished, setFinished] = useState(false);

  const { mutate: submitPractice } = api.practice.submitPractice.useMutation();
  const { isLoading } = api.practice.getDuePracticesByContextShuffled.useQuery(
    undefined, // no data
    {
      onSuccess: (practices) => {
        setRevision(practices);
      },
      refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      // refetchInterval: false,
    }
  );

  if (isLoading || !locale || !revision) {
    return <Loader />;
  }
  if (revision.length === 0 && !finished) {
    setFinished(true);
  }

  if (finished) {
    return <RevisionDonePage />;
  }

  const currentPractice = revision[wordIndex];
  const currentWord = revision[wordIndex]?.word;

  if (!currentPractice || !currentWord) {
    return <Loader />;
  }

  const onSubmit = (correct: boolean) => {
    handleSubmit(correct, currentPractice, revision.length);
  };

  function handleSubmit(
    correct: boolean,
    practice: PracticeWithWord,
    revisionLength: number
  ) {
    submitPractice({
      practiceId: practice.id,
      correct,
      oldCounter: practice.counter,
    });

    if (wordIndex < revisionLength - 1) {
      setSolutionVisible(false);
      setWordIndex(wordIndex + 1);
    } else {
      setFinished(true);
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex w-full items-center justify-between py-4 px-4 pt-8 lg:px-24 lg:pt-24">
          <LanguageSelectionButton url="/revision" locale={locale} />
          <RemainingWordsDisplay
            length={revision.length}
            index={wordIndex + 1}
          />
        </div>
        <CurrentWordDisplay
          word={currentWord}
          solutionVisible={solutionVisible}
        />
        <div className="flex w-full flex-col justify-around gap-8 py-4 px-4 pt-8 lg:flex-row lg:px-24 lg:pt-24">
          {solutionVisible && <CorrectButton onSubmit={onSubmit} />}
          {solutionVisible && <IncorrectButton onSubmit={onSubmit} />}
        </div>
        <ShowSolutionToggle
          solutionVisible={solutionVisible}
          handleSolutionToggle={() => setSolutionVisible(!solutionVisible)}
        />
        <ProgressLink />
      </main>
    </>
  );
}

function RevisionDonePage() {
  const t = useTranslations();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
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
      </main>
    </>
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
  word: Word;
  solutionVisible: boolean;
}) {
  const { locale } = useRouter();
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

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        handleSolutionToggle();
      }
    },
    [handleSolutionToggle]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

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
  onSubmit: onSubmit,
}: {
  onSubmit: (correct: boolean) => void;
}) {
  const t = useTranslations();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "f") {
        onSubmit(true);
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <button
      className="rounded-2xl border-2 bg-green-900 px-7 py-2 text-2xl md:mx-16 md:border-4 lg:py-8 lg:px-12 lg:text-4xl"
      onClick={() => onSubmit(true)}
    >
      {t("Revision.correct")}
    </button>
  );
}

function IncorrectButton({
  onSubmit: onSubmit,
}: {
  onSubmit: (correct: boolean) => void;
}) {
  const t = useTranslations();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "j") {
        onSubmit(false);
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <button
      className="rounded-2xl border-2 bg-red-900 px-7 py-2 text-2xl md:mx-16 md:border-4 md:text-3xl lg:py-8 lg:px-12 lg:text-4xl"
      onClick={() => onSubmit(false)}
    >
      {t("Revision.incorrect")}
    </button>
  );
}

// static rendering only to get the translations, rest is client side
export async function getStaticProps(ctx: GetStaticPropsContext) {
  const locale = ctx.locale || "en";
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
