import Image from "@/components/ui/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/primitives/popover-v2";
import { ComponentPropsWithoutRef } from "react";
import { IoIosLogIn } from "react-icons/io";
import { ProfilePopover } from "./profile-popover";
import { useAnimejoyUser } from "@/entities/animejoy/user/api/query";
import { useShikimoriUser } from "@/entities/shikimori/user/api/query";

type ProfileButtonProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export default function ProfileButton(props: ProfileButtonProps) {


    const { data: animejoyUser } = useAnimejoyUser();
    const { data: shikimoriUser } = useShikimoriUser();

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
            <PopoverContent asChild>
                <ProfilePopover animejoyUser={animejoyUser} shikimoriUser={shikimoriUser} />
            </PopoverContent>
        </Popover>
    );
}