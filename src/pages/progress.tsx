import { useSession } from "next-auth/react";
import type { NextPage } from "next/types";
import { api } from "../utils/api";
import Image from "next/image"
import Link from "next/link";
import MyHead from "./components/myHead";
import type { Practice, Word } from "@prisma/client";

const Home: NextPage = () => {
    const { data: session } = useSession();
    if (!session?.user) {
        return null
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
    })
    if (!data) {
        return <div>Loading...</div>
    }
    const practices = data.sort((a, b) => a.word.rank - b.word.rank)
    return <main className="min-h-screen flex flex-col justify-between">
        <div className="flex py-4 px-4 lg:px-24 justify-between items-center">
            <LanguageSelectionButton />
            <div className="text-4xl lg:text-8xl px-4 py-4">Progress</div>
            <Link href="menu" className="border-4 lg:px-6 px-2 lg:py-2 rounded-2xl text-xl lg:text-4xl ">
                Back
            </Link>
        </div>
        <div className="p-8 lg:p-16 text-center justify-center text-xs md:text-lg lg:text-xl">
            <ProgressTable practices={practices} />

        </div>
    </main>
}

function LanguageSelectionButton() {
    return <div className="flex align-middle px-2">
        <Image src={"globe.svg"} height={48} width={48} alt="Globe for language selection" />
    </div>;
}

function TableHead() {
    return (
        <thead>
            <tr >
                <th className="border-2 p-2 md:p-4 lg:px-8">Rank</th>
                <th className="border-2 p-2 md:p-4 lg:px-8">Italian</th>
                <th className="border-2 p-2 md:p-4 lg:px-8">English</th>
                <th className="border-2 p-2 md:p-4 lg:px-8">Last Practice</th>
                <th className="border-2 p-2 md:p-4 lg:px-8">Next Practice</th>
                <th className="border-2 p-2 md:p-4 lg:px-8">Counter</th>
            </tr>
        </thead>
    )
}

function ProgressTable({ practices }: { practices: (Practice & { word: Word })[] }) {
    return (
        <table className="table-auto w-full">
            <TableHead />
            <tbody >
                {practices.map((practice) => {
                    return (
                        <tr key={practice.id}>
                            <td className="border p-2 lg:px-8">{practice.word.rank}</td>
                            <td className="border p-2 lg:px-8">{practice.word.italian}</td>
                            <td className="border p-2 lg:px-8 md:whitespace-nowrap">{practice.word.english}</td>
                            <td className="border p-2 lg:px-8">{practice.lastPractice.toLocaleDateString()}</td>
                            <td className="border p-2 lg:px-8">{practice.nextPractice.toLocaleDateString()}</td>
                            <td className="border p-2 lg:px-8">{practice.counter}</td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table>
    )
}