import Image from "@/components/ui/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/primitives/popover-v2";
import { Link } from "@/components/utility/Link";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useShikimoriUser } from "@/query-hooks/useShikimoriUser";
import { getAnimejoyUserFromHeader } from "@/scraping/animejoy/user";
import { useGlobalLoading } from "@/stores/global-loading";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { openLogInPopup } from "@/utils/login-popup-window";
import ky from "ky";
import { ComponentPropsWithoutRef } from "react";
import { IoIosLogIn } from "react-icons/io";
import { useQueryClient } from "react-query";

type ProfileButtonProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export default function ProfileButton(props: ProfileButtonProps) {

    const { data: doc } = useAnimejoyPage();
    const animejoyUser = getAnimejoyUserFromHeader(doc?.page);
    const { data: shikimoriUser } = useShikimoriUser();

    const queryClient = useQueryClient();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease] as const);

    async function animejoyLogIn(e: React.MouseEvent) {
        e.preventDefault();
        increaseLoadingCount();
        try {
            await ky.post(window.location.pathname, {
                body: new FormData(document.querySelector("form")!),
            });
            await queryClient.refetchQueries(["animejoy", "page", window.location.pathname]);
        } catch (err) {
            console.error(err);
        }
        decreaseLoadingCount();
    }

    async function animejoyLogOut() {
        increaseLoadingCount();
        try {
            await ky.get("https://animejoy.ru/index.php?action=logout");
            await queryClient.refetchQueries(["animejoy", "page", window.location.pathname]);
        } catch (err) {
            console.error(err);
        }
        decreaseLoadingCount();
    }

    async function shikimoriLogIn() {
        await openLogInPopup(
            () => increaseLoadingCount(),
            () => queryClient.invalidateQueries(["shikimori", "whoami"]),
        );
    }

    async function shikimoriLogOut() {
        increaseLoadingCount();
        await ky.post(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth/logout", {
            credentials: "include",
        });
        queryClient.setQueryData(["shikimori", "whoami"], null);
        decreaseLoadingCount();
    }

    return (
        <Popover {...props}>
            <PopoverTrigger className={"grid size-full place-items-center"}>
                {shikimoriUser || animejoyUser
                    ? (
                        <Image
                            className={""}
                            src={shikimoriUser?.avatar || animejoyUser?.avatar}
                            alt={""}
                        />
                    )
                    : <IoIosLogIn className={"text-2xl"} />}
                <span className={"absolute bottom-1"}>{shikimoriUser || animejoyUser ? "Профиль" : "Вход"}</span>
            </PopoverTrigger>
            <PopoverContent className={"absolute left-full text-base bg-background-secondary p-5 bottom-0"}>
                <div className={""}>
                    <h3 children={"Профиль Shikimori"} />
                    {shikimoriUser
                        ? (
                            <>
                                <a href={shikimoriUser?.url} target={"_blank"}>
                                    <img src={shikimoriUser.image.x160} alt={""} />
                                    <p children={shikimoriUser?.nickname || "Войти"} />
                                </a>
                                <div className={""}>
                                    <button onClick={shikimoriLogOut}>Выйти</button>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <button onClick={shikimoriLogIn}>
                                    <IoIosLogIn />
                                    <span>Войти</span>
                                </button>
                                <div className={""}>
                                    <a href={"https://shikimori.me/users/sign_up"} target={"_blank"}>Регистрация</a>
                                </div>
                            </>
                        )}
                </div>
                <div className={""}>
                    <h3 children={"Профиль AnimeJoy"} />
                    {animejoyUser
                        ? (
                            <>
                                <Link to={animejoyUser?.url || "/tbd"}>
                                    <img src={animejoyUser.avatar} alt={""} />
                                    <p children={animejoyUser?.nickname || "Войти"} />
                                </Link>
                                <div className={""}>
                                    <button onClick={animejoyLogOut}>Выйти</button>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <form method={"post"}>
                                    <input name={"login_name"} placeholder={"Логин"} type={"text"} />
                                    <input name={"login_password"} placeholder={"Пароль"} type={"password"} />
                                    <button type={"submit"} onClick={animejoyLogIn}>
                                        <IoIosLogIn />
                                        <span>Войти</span>
                                    </button>
                                    <input name={"login"} type={"hidden"} value={"submit"} />
                                </form>
                                <div className={""}>
                                    <Link to={"/index.php?do=register"}>Регистрация</Link>
                                    <Link to={"/index.php?do=lostpassword"}>Забили пароль?</Link>
                                </div>
                            </>
                        )}
                </div>
            </PopoverContent>
        </Popover>
    );
}