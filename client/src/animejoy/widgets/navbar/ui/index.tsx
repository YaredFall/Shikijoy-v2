import Menu from "./menu";
import { trpc } from "@/shared/api/trpc";
import Container from "@/shared/ui/kit/container";
import ShikijoyLogo from "@/shared/ui/misc/shikijoy-logo";
import { Link, useLoaderData } from "@tanstack/react-router";
import { Slot } from "@radix-ui/react-slot";
import { PropsWithChildren } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/popover";
import { RxHamburgerMenu } from "react-icons/rx";
import { animejoyClient } from "@/animejoy/shared/api/client";
import Image from "@/shared/ui/kit/image";
import { getAnimejoyUserFromHeader } from "@/animejoy/entities/user/scraping";
import { IoIosLogIn } from "react-icons/io";
import { ProfilePopover } from "@/animejoy/widgets/navbar/ui/profile";
import { cn } from "@/shared/lib/cn";
import ShikimoriLogo from "@/shared/ui/misc/shikimori-logo";


export default function Navbar() {

    const { location } = useLoaderData({ from: "__root__" });

    const { data: shikimoriUser } = trpc.shikimori.users.whoami.useQuery();
    const [animejoyUser] = animejoyClient.page.useSuspenseQuery(location.pathname, {
        select: data => getAnimejoyUserFromHeader(data.document),
    });

    return (
        <nav className={"fixed inset-y-0 left-0 z-[1000] w-header-width p-1.5 text-xs text-foreground-primary/75"}>
            <Container className={"flex size-full flex-col gap-2 p-0 pb-1"}>
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
                <NavbarItem className={"mt-auto"}>
                    <Popover>
                        <PopoverTrigger className={"grid size-full place-items-center data-[state=open]:text-foreground-primary"}>
                            {shikimoriUser || animejoyUser
                                ? (
                                    <div className={"relative mb-1 size-9"}>
                                        <Image
                                            className={"rounded"}
                                            src={shikimoriUser?.avatar || animejoyUser?.avatar}
                                            alt={""}
                                        />
                                        {
                                            shikimoriUser && (
                                                <div className={"absolute -right-0.5 top-0 size-5 -translate-y-1/2 translate-x-1/2 rounded-full   bg-white p-0.5"}>
                                                    <ShikimoriLogo className={"size-full"} />
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                                : <IoIosLogIn className={"text-2xl"} />}
                            <NavbarItemLabel>{shikimoriUser || animejoyUser ? "Профиль" : "Вход"}</NavbarItemLabel>
                        </PopoverTrigger>
                        <PopoverContent asChild>
                            <ProfilePopover
                                animejoyUser={animejoyUser}
                                shikimoriUser={shikimoriUser}
                                className={"-mb-1 text-foreground-primary"}
                            />
                        </PopoverContent>
                    </Popover>
                </NavbarItem>
            </Container>
        </nav>
    );
}

type NavbarItemProps = PropsWithChildren<{ className?: string; }>;
function NavbarItem({ children, className }: NavbarItemProps) {
    return (
        <Slot className={cn("group relative flex aspect-square w-full items-center justify-center p-2 pb-5 transition-colors highlight:text-foreground-primary [&_.active]:text-foreground-primary", className)}>
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