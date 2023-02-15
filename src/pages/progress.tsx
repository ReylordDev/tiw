import { useSession } from "next-auth/react";
import type { NextPage } from "next/types";
import { api } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import MyHead from "./components/myHead";
import type { Practice, Word } from "@prisma/client";

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
        <div className="px-4 py-4 text-4xl lg:text-8xl">Progress</div>
        <Link
          href="menu"
          className="rounded-2xl border-4 px-2 text-xl lg:px-6 lg:py-2 lg:text-4xl "
        >
          Back
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
  return (
    <thead>
      <tr>
        <th className="border-2 p-2 md:p-4 lg:px-8">Rank</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">Italian</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">English</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">Last Practice</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">Next Practice</th>
        <th className="border-2 p-2 md:p-4 lg:px-8">Counter</th>
      </tr>
    </thead>
  );
}

function ProgressTable({
  practices,
}: {
  practices: (Practice & { word: Word })[];
}) {
  return (
    <table className="w-full table-auto">
      <TableHead />
      <tbody>
        {practices.map((practice) => {
          return (
            <tr key={practice.id}>
              <td className="border p-2 lg:px-8">{practice.word.rank}</td>
              <td className="border p-2 lg:px-8">{practice.word.italian}</td>
              <td className="border p-2 md:whitespace-nowrap lg:px-8">
                {practice.word.english}
              </td>
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
