import { Link } from "react-router-dom";


type HeaderProps = {};

export default function Header({ }: HeaderProps) {

  return (
    <header className="fixed left-0 h-full w-header border-r-2 border-secondary">
      <nav className="flex flex-col h-full">
        <Link className="h-header flex items-center justify-center group" to={"/"}>Home</Link>
        <div className="h-header flex items-center justify-center group">Menu</div>
        <div className="h-header flex items-center justify-center group mt-auto">Profile</div>
        <div className="h-header flex items-center justify-center group">Settings</div>
      </nav>
    </header>
  );
}