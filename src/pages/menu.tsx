import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import AddWordsModal from "./components/AddWordsModal";
import { getServerAuthSession } from "../server/auth";
import { signOut } from "next-auth/react";
import MyHead from "./components/myHead";

function MenuPage({ userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [modalOpen, setModalOpen] = useState(false);
    const { data: user } = api.user.getById.useQuery({ id: userId })
    if (!user) return null;
    console.log(user);


    return (
        <>
            <MyHead />
            <main className="min-h-screen flex flex-col items-center justify-between">
                {modalOpen && <AddWordsModal setModal={setModalOpen} currentRank={user?.currentRankProgress} userId={user?.id} />}
                <div className="flex w-full py-4 px-4 pt-8 lg:px-24   justify-between">
                    <LanguageSelectionButton />
                    <button className="text-2xl lg:text-4xl" onClick={() => void signOut()}>Sign out</button>
                </div>
                <TitleHeader />
                <div className="my-4"></div>
                <PracticeButton />
                <AddWordsButton setModal={setModalOpen} />
                <ProgressButton />
                <div className="my-4"></div>
                <div></div>
            </main>
        </>
    );
}

export default MenuPage;


function LanguageSelectionButton() {
    return <div className="">
        <Image src={"globe.svg"} height={48} width={48} alt="Globe for language selection" />
    </div>;
}

function TitleHeader() {
    return <div className="text-2xl lg:text-7xl lg:border-7 border-4 lg:px-20 lg:py-8 px-6 py-4 rounded-2xl lg:rounded-[36px]">
        Top 1000 Italian Words
    </div>;
}

function PracticeButton() {
    return (<Link className="text-3xl lg:text-4xl lg:border-6 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-2xl"
        href={'revision'}>
        Practice
    </Link>)
}

function AddWordsButton(props: { setModal: (open: boolean) => void }) {
    return (<button className="text-3xl lg:text-4xl lg:border-6 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-2xl"
        onClick={() => {
            props.setModal(true);
        }}>
        Add more words
    </button>)
}

function ProgressButton() {
    return (<Link className="text-3xl lg:text-4xl lg:border-6 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-2xl"
        href={'progress'}>
        Progress
    </Link>)
}

// todo: remove server side rendering
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (!session?.user?.id) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        };
    }

    return {
        props: {
            userId: session.user.id,
        },
    };
}

