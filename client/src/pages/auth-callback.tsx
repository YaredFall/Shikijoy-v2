import { FC, useState } from "react";
import plural from "plural-ru";
import { trpc } from "@client/shared/api/trpc";
import { User } from "node-shikimori";
import { useEffectOnce } from "@client/shared/hooks/useEffectOnce";
import { useEffectOnChange } from "@client/shared/hooks/useOnChange";

type AuthCallbackPageProps = {
    code: string;
};

export default function AuthCallbackPage({ code }: AuthCallbackPageProps) {

    const { mutate, isError, isSuccess } = trpc.shikimori.auth.getTokens.useMutation({
        onSuccess: () => {
            (window.opener as Window).dispatchEvent(new CustomEvent("auth_success"));
        },
        onError: () => {
            (window.opener as Window).dispatchEvent(new CustomEvent("auth_error"));
        },
    });

    const { data: user } = trpc.shikimori.users.whoami.useQuery(undefined, {
        enabled: isSuccess,
    });

    useEffectOnce(() => {
        setTimeout(() => {
            mutate({ code });
        }, 0);
    }, [code, mutate]);

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

    useEffectOnChange(secondsBeforeClosing, () => {
        const timeout = setTimeout(() => {
            if (secondsBeforeClosing > 1) {
                setSecondsBeforeClosing(prev => prev - 1);
            } else {
                window.close();
            }
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    });

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