import { useSession } from "next-auth/react";
import type { GetStaticPropsContext, NextPage } from "next/types";
import { api } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import MyHead from "./components/myHead";
import type { Practice, Word } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { NotLoggedInPage } from ".";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session || !session.user || !session.user.id) {
    return <NotLoggedInPage />;
  } else {
    return <ProgressPage userId={session.user.id} />;
  }
};

export default Home;

function ProgressPage({ userId }: { userId: string }) {
  const t = useTranslations();
  const { data } = api.practice.getPracticesWithWordsByUserId.useQuery({
    userId: userId,
  });
  if (!data) {
    return <div>Loading...</div>;
  }
  const practices = data.sort((a, b) => a.word.rank - b.word.rank);
  return (
    <>
      <MyHead />
      <main className="flex min-h-screen flex-col justify-between ">
        <div className="flex items-center justify-between  py-4 px-4 lg:px-24">
          <LanguageSelectionButton />
          <Link
            href="/"
            className="rounded-2xl border-2 p-2 text-2xl lg:px-6 lg:py-2 lg:text-4xl "
          >
            {t("Revision.back")}
          </Link>
        </div>
        <div className="mx-16 my-4 rounded-2xl border-2 px-4 py-4 text-center text-4xl md:mx-32 lg:mx-96 lg:text-8xl">
          {t("Index.progressButton")}
        </div>
        <div className="justify-center overflow-scroll text-center text-xs md:p-8 md:text-lg lg:p-16 lg:text-xl">
          <ProgressTable practices={practices} />
        </div>
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
      href="/progress"
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

function TableHead() {
  const t = useTranslations();
  const { locale } = useRouter();
  return (
    <thead>
      <tr>
        <th className="border-2 p-2 md:p-4 lg:px-8">{t("Progress.rank")}</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">{t("Progress.italian")}</th>
        {locale === "en" && (
          <th className="border-2 p-2 md:p-4 lg:px-8">
            {t("Progress.english")}
          </th>
        )}
        {locale === "de" && (
          <th className="border-2 p-2 md:p-4 lg:px-8">
            {t("Progress.german")}
          </th>
        )}
        <th className="border-2 p-2 md:p-4 lg:px-8">
          {t("Progress.lastPractice")}
        </th>
        <th className="border-2 p-2 md:p-4 lg:px-8">
          {t("Progress.nextPractice")}
        </th>
        <th className="border-2 p-2 md:p-4 lg:px-8">{t("Progress.counter")}</th>
      </tr>
    </thead>
  );
}

function ProgressTable({
  practices,
}: {
  practices: (Practice & { word: Word })[];
}) {
  const { locale } = useRouter();
  return (
    <table className="w-full table-auto">
      <TableHead />
      <tbody>
        {practices.map((practice) => {
          return (
            <tr key={practice.id}>
              <td className="border p-2 lg:px-8">{practice.word.rank}</td>
              <td className="border p-2 lg:px-8">{practice.word.italian}</td>
              {locale === "en" && (
                <td className="border p-2 md:whitespace-nowrap lg:px-8">
                  {practice.word.english}
                </td>
              )}
              {locale === "de" && (
                <td className="border p-2 md:whitespace-nowrap lg:px-8">
                  {practice.word.german}
                </td>
              )}
              <td className="border p-2 lg:px-8">
                {practice.lastPractice.toLocaleDateString()}
              </td>
              <td className="border p-2 lg:px-8">
                {practice.nextPractice.toLocaleDateString()}
              </td>
              <td className="border p-2 lg:px-8">{practice.counter}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
