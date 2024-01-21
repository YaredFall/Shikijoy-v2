import { Link } from "react-router-dom";


type HeaderProps = Record<never, never>;

export default function Header({ }: HeaderProps) {

    return (
        <header className="fixed left-0 h-full w-header border-r-2 border-secondary text-xs">
            <nav className="flex flex-col h-full">
                <Link className="h-header flex items-center justify-center group" to={"/"}>Главная</Link>
                <div className="h-header flex items-center justify-center group">Меню</div>
                <div className="h-header flex items-center justify-center group mt-auto">Профиль</div>
                <div className="h-header flex items-center justify-center group">Настройки</div>
            </nav>
        </header>
    );
}