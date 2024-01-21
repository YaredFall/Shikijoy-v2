import Menu from "@/components/nav/menu";
import { Link } from "@/components/utility/Link";


type HeaderProps = Record<never, never>;

export default function Header({ }: HeaderProps) {

    return (
            <nav className="flex flex-col h-full">
                <Link className="h-header flex items-center justify-center group" to={"/"}>Главная</Link>
                <div className="h-header flex items-center justify-center group mt-auto">Профиль</div>
                <div className="h-header flex items-center justify-center group">Настройки</div>
            </nav>
        </header>
    );
}