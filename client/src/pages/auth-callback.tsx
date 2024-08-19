import { FC, useEffect, useState } from "react";
import plural from "plural-ru";
import { trpc } from "@/shared/api/trpc";
import { User } from "node-shikimori";

type AuthCallbackPageProps = {
    code: string;
};

export default function AuthCallbackPage({ code }: AuthCallbackPageProps) {

    const { data: token, isError } = trpc.shikimori.auth.getTokens.useQuery({ code }, {
        refetchOnWindowFocus: false,
    });
    const { data: user } = trpc.shikimori.users.whoami.useQuery(undefined, {
        enabled: !!token?.success,
    });

    return (
        <div>
            {isError ? "Произошла ошибка!" : (user ? <SuccessfulLogInPage user={user} /> : "Загрузка...")}
        </div>
    );
}


type SuccessfulLogInPageProps = {
    user: User | undefined;
};
const SuccessfulLogInPage: FC<SuccessfulLogInPageProps> = ({ user }) => {
    const [secondsBeforeClosing, setSecondsBeforeClosing] = useState(3);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (secondsBeforeClosing > 1) {
                setSecondsBeforeClosing(prev => prev - 1);
            } else {
                // window.close();
            }
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [secondsBeforeClosing]);


    return (
        <div className={""}>
            <div className={""}>
                <img src={user?.avatar} />
                <span>{user?.nickname}</span>
            </div>
            <h1>Авторизация успешна</h1>
            <p>
                Окно закроется через {plural(secondsBeforeClosing, "%d секунду", "%d секунды")}
            </p>
        </div>
    );
};