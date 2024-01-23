import Menu from "@/components/layouts/blocks/header/menu";
import { Link } from "@/components/utility/Link";


type HeaderProps = Record<never, never>;

export default function Header({ }: HeaderProps) {

    return (
        <header className={"fixed left-0 h-full w-header-width bg-neutral-900 text-xs z-10"}>
            <nav className={"flex flex-col h-full"}>
                <Link className={"w-full aspect-square flex items-center justify-center group"} to={"/"}>Главная</Link>
                <Menu className={"w-full aspect-square flex items-center justify-center group"} />
                <div className={"w-full aspect-square flex items-center justify-center group mt-auto"}>Профиль</div>
                <div className={"w-full aspect-square flex items-center justify-center group"}>Настройки</div>
            </nav>
        </header>
    );
}