import { useSession } from "next-auth/react";
import type { NextPage } from "next/types";
import { api } from "../utils/api";
import Image from "next/image"
import Link from "next/link";
import MyHead from "./components/myHead";

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
    const { data: user } = api.user.getById.useQuery({
        id: userId,
    })
    console.log(user)
    return <main className="min-h-screen flex flex-col  justify-between">
        <div className="flex w-full py-4 px-4 lg:px-24 bg-red-400 justify-between">
            <LanguageSelectionButton />
            <div className="text-5xl lg:text-8xl lg:border-7 border-b-4 px-4 py-4    ">Progress</div>
            <div className=" bg-green-400">
                <Link href="menu" className=" lg:border-4 lg:px-6 rounded-2xl text-4xl  ">
                    Back
                </Link>
            </div>
        </div>
    </main>
}

function LanguageSelectionButton() {
    return <div className="bg-blue-400">
        <Image src={"globe.svg"} height={48} width={48} alt="Globe for language selection" />
    </div>;
}