import { useSession } from "next-auth/react";
import type { GetServerSidePropsContext, NextPage } from "next/types";
import { api } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import MyHead from "./components/myHead";
import type { Practice, Word } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session } = useSession();
  // should this be server side rendering? like in index.tsx?
  if (!session?.user) {
    return null;
  }

  return (
    <>
      <MyHead />
      <ProgressPage userId={session.user.id} />
    </>
  );
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
    <main className="flex min-h-screen flex-col justify-between">
      <div className="flex items-center justify-between py-4 px-4 lg:px-24">
        <LanguageSelectionButton />
        <div className="px-4 py-4 text-4xl lg:text-8xl">
          {t("Menu.progressButton")}
        </div>
        <Link
          href="menu"
          className="rounded-2xl border-4 px-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
        >
          {t("Revision.back")}
        </Link>
      </div>
      <div className="justify-center p-8 text-center text-xs md:text-lg lg:p-16 lg:text-xl">
        <ProgressTable practices={practices} />
      </div>
    </main>
  );
}

function LanguageSelectionButton() {
  return (
    <div className="flex px-2 align-middle">
      <Image
        src={"globe.svg"}
        height={48}
        width={48}
        alt="Globe for language selection"
      />
    </div>
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const locale = ctx.locale || "en";
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
