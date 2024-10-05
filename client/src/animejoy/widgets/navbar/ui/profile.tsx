import { FormEventHandler, forwardRef, useCallback } from "react";
import { IoIosLogIn } from "react-icons/io";
import type { User as ShikimoriUser } from "node-shikimori";
import { cn } from "@client/shared/lib/cn";
import { AnimejoyUser } from "@client/animejoy/entities/user/model";
import { useAnimejoyLogIn } from "@client/features/auth/animejoyLogIn";
import { Link } from "@tanstack/react-router";
import { useShikimoriLogIn } from "@client/features/auth/shikimoriLogIn";

type ProfilePopoverProps = {
    animejoyUser: AnimejoyUser | undefined | null;
    shikimoriUser: ShikimoriUser | undefined | null;
    className?: string;
};

export const ProfilePopover = forwardRef<HTMLDivElement, ProfilePopoverProps>(({ className, animejoyUser, shikimoriUser }, forwardedRef) => {

    return (
        <div
            className={cn("flex flex-col gap-10 bg-gradient-to-br from-accent-primary/5 to-background-secondary/60 px-8 py-5 text-base direct-children:w-48", className)}
            ref={forwardedRef}
        >
            <ShikimoriProfile user={shikimoriUser} />
            <AnimejoyProfile user={animejoyUser} />
        </div>
    );
});
ProfilePopover.displayName = "ProfilePopover";


const templateClasses = {
    header: "text-lg leading-tight text-center",
    input: "px-2 pt-1 pb-0.5 rounded",
    form: "flex flex-col gap-1.5 justify-center mt-6 mb-4",
    additionalActions: "mt-auto text-xs text-foreground-primary/.5 flex justify-around gap-4 highlight:direct-children:text-foreground-primary/.25 direct-children:transition-colors",
    userLink: "flex text-sm flex-col items-center gap-1.5 justify-center mt-6 mb-4",
    userImage: "rounded size-16",
    primaryBtn: "highlight:text-foreground-primary/.75 transition-colors",
};

function AnimejoyProfile({ user }: { user: AnimejoyUser | undefined | null; }) {

    const { logIn, logOut } = useAnimejoyLogIn();

    const onLogIn = useCallback((data: FormData) => logIn(data), [logIn]);
    const onLogOut = useCallback(() => logOut(), [logOut]);

    const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();
        onLogIn(new FormData(e.target as HTMLFormElement));
    }, [onLogIn]);

    return (
        <div className={""}>
            <header className={templateClasses.header}>Профиль AnimeJoy</header>
            {user
                ? (
                    <>
                        <Link className={templateClasses.userLink} to={user.url}>
                            <img className={templateClasses.userImage} src={user.avatar} />
                            <p>{user.nickname}</p>
                        </Link>
                        <div className={templateClasses.additionalActions}>
                            <button onClick={onLogOut}>Выйти</button>
                        </div>
                    </>
                )
                : (
                    <>
                        <form className={templateClasses.form} onSubmit={onFormSubmit}>
                            <input className={templateClasses.input} name={"login_name"} placeholder={"Логин"} type={"text"} />
                            <input className={templateClasses.input} name={"login_password"} placeholder={"Пароль"} type={"password"} />
                            <button className={cn("flex w-full justify-center gap-2 p-2", templateClasses.primaryBtn)} type={"submit"}>
                                <IoIosLogIn className={"text-2xl"} />
                                <span>Войти</span>
                            </button>
                            <input name={"login"} type={"hidden"} value={"submit"} />
                        </form>
                        {/* TODO <div className={templateClasses.additionalActions}>
                            <Link to={"/index.php?do=register"}>Регистрация</Link>
                            <Link to={"/index.php?do=lostpassword"}>Забили пароль?</Link>
                        </div> */}
                    </>
                )}
        </div>
    );
}

function ShikimoriProfile({ user }: { user: ShikimoriUser | undefined | null; }) {

    const { logIn, logOut } = useShikimoriLogIn();

    const onLogIn = useCallback(() => logIn(), [logIn]);
    const onLogOut = useCallback(() => logOut(), [logOut]);


    return (
        <div className={""}>
            <header className={templateClasses.header}>Профиль Shikimori</header>
            {user
                ? (
                    <>
                        <a className={templateClasses.userLink} href={user.url} target={"_blank"} rel={"noreferrer"}>
                            <img className={templateClasses.userImage} src={user.image.x160} alt={""} />
                            <p>{user.nickname || "Войти"}</p>
                        </a>
                        <div className={templateClasses.additionalActions}>
                            <button onClick={onLogOut}>Выйти</button>
                        </div>
                    </>
                )
                : (
                    <>
                        <div className={templateClasses.form}>
                            <button
                                className={cn("flex w-full flex-col items-center justify-center p-4 text-lg", templateClasses.primaryBtn)}
                                onClick={onLogIn}
                            >
                                <IoIosLogIn className={"text-7xl"} />
                                <span>Войти</span>
                            </button>
                        </div>
                        <div className={templateClasses.additionalActions}>
                            <a href={"https://shikimori.me/users/sign_up"} target={"_blank"} rel={"noreferrer"}>Регистрация</a>
                        </div>
                    </>
                )}
        </div>
    );
}