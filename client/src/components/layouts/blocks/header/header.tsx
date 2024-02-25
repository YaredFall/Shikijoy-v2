import Menu from "@/components/layouts/blocks/header/menu";
import { Link } from "@/components/utility/Link";


type HeaderProps = Record<never, never>;

export default function Header({ }: HeaderProps) {

    return (
        <header className={"fixed left-0 z-10 flex h-full w-header-width text-xs"}>
            <nav className={"m-1.5 flex w-full flex-col rounded-md bg-background-primary"}>
                <Link className={"group flex aspect-square w-full items-center justify-center"} to={"/"}>Главная</Link>
                <Menu className={"group flex aspect-square w-full items-center justify-center"} />
                <div className={"group mt-auto flex aspect-square w-full items-center justify-center"}>Профиль</div>
                <div className={"group flex aspect-square w-full items-center justify-center"}>Настройки</div>
            </nav>
        </header>
    );
}