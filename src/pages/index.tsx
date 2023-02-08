import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import MyHead from "./components/myHead";

const Home: NextPage = () => {
    return (
        <>
            <MyHead />
            <main className="min-h-screen flex flex-col items-center justify-between">
                <div className="flex w-full py-4 px-4 pt-8 lg:px-24 lg:pt-24  justify-between">
                    <LanguageSelectionButton />
                </div>
                <TitleHeader />
                <div className="my-4"></div>
                <NotLoggedInText />
                <LogInButton />
                <div className="my-4"></div>
                <div></div>
            </main>
        </>
    );
};

export default Home;


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

function NotLoggedInText() {
    return (<div className="text-xl lg:text-4xl text-center px-6 lg:px-14 lg:py-8 py-4">
        You&apos;re not currently <br></br>logged in.
    </div>)
}

function LogInButton() {
    return (<button className="text-3xl lg:text-4xl lg:border-6 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-2xl"
        onClick={() => void signIn()}>
        Log in
    </button>)
}

//todo: remove server side rendering
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (session?.user) {
        return {
            redirect: {
                // what is permanent?
                permanent: false,
                destination: '/menu',
            },
        };
    }

    return { props: {} };
}