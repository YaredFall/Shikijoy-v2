import Menu from "./menu";
import { useShikimoriLogIn } from "@/features/auth/shikimoriLogIn";
import { trpc } from "@/shared/api/trpc";
import Container from "@/shared/ui/kit/container";
import ShikijoyLogo from "@/shared/ui/misc/shikijoy-logo";
import { Link } from "@tanstack/react-router";
import { Slot } from "@radix-ui/react-slot";
import { PropsWithChildren } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/popover";
import { RxHamburgerMenu } from "react-icons/rx";


export default function Navbar() {

    const { data: user } = trpc.shikimori.users.whoami.useQuery();
    const { logIn, logOut } = useShikimoriLogIn();

    return (
        <nav className={"fixed inset-y-0 left-0 z-[1000] w-header-width p-1.5 text-xs text-foreground-primary/75"}>
            <Container className={"flex size-full flex-col gap-2 p-0"}>
                <NavbarItem>
                    <Link to={"/"} className={"group block"}>
                        <ShikijoyLogo className={"mb-0.5 ml-1.5 size-8 grayscale-[50%] transition-[filter] group-highlight:grayscale-0"} />
                        <NavbarItemLabel>Главная</NavbarItemLabel>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Popover className={"relative !p-0"}>
                        <PopoverTrigger className={"flex size-full items-center justify-center p-2 pb-5 data-[state=open]:text-foreground-primary"}>
                            <RxHamburgerMenu className={"size-6"} />
                            <NavbarItemLabel>
                                Меню
                            </NavbarItemLabel>
                        </PopoverTrigger>
                        <PopoverContent className={"absolute left-full top-0 ml-0.5 w-52 overflow-hidden rounded-md bg-background-primary text-sm"}>
                            <Menu />
                        </PopoverContent>
                    </Popover>
                </NavbarItem>
                <NavbarItem>
                    <button
                        onClick={() => (user ? logOut() : logIn())}
                        className={"mt-auto"}
                    >
                        {user ? "Sing Out" : "Sign In"}
                    </button>
                </NavbarItem>
            </Container>
        </nav>
    );
}

type NavbarItemProps = PropsWithChildren;
function NavbarItem({ children }: NavbarItemProps) {
    return (
        <Slot className={"group relative flex aspect-square w-full items-center justify-center p-2 pb-5 transition-colors highlight:text-foreground-primary [&_.active]:text-foreground-primary"}>
            {children}
        </Slot>
    );
}

type NavbarItemLabelProps = PropsWithChildren;
function NavbarItemLabel({ children }: NavbarItemLabelProps) {
    return (
        <span className={"absolute bottom-1 left-0 w-full text-center"}>{children}</span>
    );
}