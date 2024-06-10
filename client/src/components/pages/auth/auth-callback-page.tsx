import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import plural from "plural-ru";
import { useShikimoriTokens } from "@/query-hooks/useShikimoriTokens";
import { ShikimoriUser } from "@/types/shikimori";
import { useShikimoriUser } from "@/entities/shikimori/user/api/query";

type AuthCallbackPageProps = Record<never, never>;

const AuthCallbackPage: FC<AuthCallbackPageProps> = () => {
    
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    
    const { data: token, isError } = useShikimoriTokens(code);
    const { data: user } = useShikimoriUser({
        enabled: !!token,
    });
    
    return (
        <div>
            { isError ? "Произошла ошибка!" : (user ? <SuccessfulLogInPage user={user} /> : "Загрузка...")}
        </div>
    );
};

export default AuthCallbackPage;

type SuccessfulLogInPageProps = {
    user: ShikimoriUser | undefined;
};
const SuccessfulLogInPage: FC<SuccessfulLogInPageProps> = ({ user }) => {
    const [secondsBeforeClosing, setSecondsBeforeClosing] = useState(3);

    useEffect(() => {
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