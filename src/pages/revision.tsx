import type { Practice, Word } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { completePractice } from "../server/revisionCalculations";
import { api } from "../utils/api";
import MyHead from "./components/myHead";

const Home: NextPage = () => {
    const { data: session } = useSession();
    if (!session?.user) {
        return null
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
    const [revision, setRevision] = useState<(Practice & {
        word: Word;
    })[]>()
    const [wordIndex, setWordIndex] = useState(0)
    const [solutionVisible, setSolutionVisible] = useState(false)
    const [finished, setFinished] = useState(false)
    const { mutate: updatePractice } = api.practice.updatePractice.useMutation();
    const { data: practices, isLoading } = api.practice.getDuePracticesByUserId.useQuery({ userId: userId }, {
        onSuccess: (data) => {
            setRevision(data)
        },
        refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
        // refetchInterval: false,
    })
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!practices || !revision) {
        console.log(practices);
        return <div>Loading...</div>
    }
    if (revision.length === 0 && !finished) {
        setFinished(true)
    }

    function handleSolutionToggle() {
        console.log("Solution", solutionVisible ? "hidden" : "visible");
        setSolutionVisible(!solutionVisible)
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
        const { newCounter, nextPracticeDate } = completePractice(correct, practice);
        updatePractice({
            practiceId: practice.id,
            nextPractice: nextPracticeDate,
            newCounter,
        })
        if (wordIndex < revision.length - 1) {
            setSolutionVisible(false)
            setWordIndex(wordIndex + 1)
        } else {
            setFinished(true)
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-between">
            {finished && <>
                <div>
                </div>
                <div className="text-5xl lg:text-7xl lg:border-7 border-b-4 lg:px-20 lg:py-8 px-6 py-4 rounded-3xl lg:rounded-[36px]">You&apos;re done!</div>
                <p className="text-2xl lg:text-4xl lg:px-20 lg:py-8 px-6 py-4 text-center">Make sure to come back tomorrow<br></br>to continue learning.</p>
                <p className="text-xl lg:text-3xl lg:px-20 lg:py-8 px-6 pt-20 text-center">Check your progress in the meantime</p>
                <ProgressLink />
                <div></div>
            </>}
            {!finished && <>
                <div className="flex w-full py-4 px-4 pt-8 lg:px-24 lg:pt-24  justify-between">
                    <LanguageSelectionButton />
                    <RemainingWordsDisplay length={revision.length} index={wordIndex + 1} />
                </div>
                <CurrentWordDisplay word={revision[wordIndex]?.word} solutionVisible={solutionVisible} />
                <div className="flex w-full py-4 px-4 pt-8 lg:px-24 lg:pt-24 flex-col lg:flex-row gap-8 justify-around">
                    {solutionVisible && <CorrectButton handleSubmit={handleSubmit} />}
                    {solutionVisible && <IncorrectButton handleSubmit={handleSubmit} />}
                </div>
                <ShowSolutionToggle solutionVisible={solutionVisible} handleSolutionToggle={handleSolutionToggle} />
                <div className="flex w-full py-4 px-4 lg:pb-12 justify-center items-center lg:justify-between">
                    <div className="lg:w-32"></div>
                    <ProgressLink />
                    <RemainingWordsDisplayLarge length={revision.length} index={wordIndex + 1} />
                </div>
            </>}
        </main>
    )
}

function LanguageSelectionButton() {
    return <div className="invisible">
        <Image src={"globe.svg"} height={48} width={48} alt="Globe for language selection" />
    </div>;
}

function RemainingWordsDisplay({ length, index }: { length: number, index: number }) {
    return <div className="border-4 px-4 py-2 rounded-2xl text-2xl  lg:hidden">
        {index}/{length}
    </div>;
}

function RemainingWordsDisplayLarge({ length, index }: { length: number, index: number }) {
    return <div className="w-0 lg:border-4 lg:px-6 lg:py-3 rounded-2xl text-4xl lg:w-auto invisible lg:visible">
        {index}/{length}
    </div>;
}

function CurrentWordDisplay({ word, solutionVisible }: { word: Word | undefined, solutionVisible: boolean }) {
    if (!word) {
        return <div className="text-5xl lg:text-7xl lg:border-7 border-4 lg:px-20 lg:py-8 px-6 py-4 rounded-3xl lg:rounded-[36px]">

        </div>;
    }
    return <div className="text-5xl lg:text-7xl lg:border-7 border-4 lg:px-20 lg:py-8 px-6 py-4 rounded-3xl lg:rounded-[36px]">
        {solutionVisible ? word.english : word.italian}
    </div>;
}

function ShowSolutionToggle({ solutionVisible, handleSolutionToggle }: { solutionVisible: boolean, handleSolutionToggle: () => void }) {
    return (<button className="text-3xl lg:text-4xl lg:border-6 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-3xl"
        onClick={() => handleSolutionToggle()}>
        {solutionVisible && "Hide Solution"}
        {!solutionVisible && "Show Solution"}
    </button>)
}

function ProgressLink() {
    return <Link href={'/progress'} className="text-4xl lg:text-3xl lg:border-b-6 border-b-4  px-1 lg:px-3 py-1  rounded-sm ">
        Progress
    </Link>
}

function CorrectButton({ handleSubmit }: { handleSubmit: (correct: boolean) => void }) {
    return <button className="border-2 px-7 py-2 rounded-2xl text-2xl bg-green-900"
        onClick={() => handleSubmit(true)}>
        Correct
    </button>;
}

function IncorrectButton({ handleSubmit }: { handleSubmit: (correct: boolean) => void }) {
    return <button className="border-2 px-4 py-2 rounded-2xl text-2xl bg-red-900"
        onClick={() => handleSubmit(false)}>
        Incorrect
    </button>;
}