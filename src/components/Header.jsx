import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { gameCatalog } from "@/data/gameCatalog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-[#f2f2f2] z-50 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="m-[13px] h-[44px] w-[44px] flex items-center justify-center rounded-md text-primary hover:opacity-80 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          role="img"
          aria-label="A logo"
          className="w-full h-full"
        >
          <rect width="120" height="120" rx="22" className="fill-primary" />
          <circle
            cx="60"
            cy="45"
            r="22"
            className="fill-primary-foreground opacity-20"
          />
          <text
            x="60"
            y="76"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="34"
            fontWeight="700"
            className="fill-primary-foreground"
          >
            A
          </text>
        </svg>
      </Link>

      {/* Nav bar */}
      <nav className="mr-8 font-medium text-lg text-foreground flex items-center gap-4">
        {/* Desktop Nav bar (>800px) */}
        <div className="hidden min-[800px]:flex gap-4 items-center">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/decode" className="transition-colors hover:text-primary">
            Decode
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/matcho" className="transition-colors hover:text-primary">
            Matcho
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/catcher" className="transition-colors hover:text-primary">
            Catcher
          </Link>
        </div>

        {/* Hamburger Games Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors border-none bg-transparent dark:hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle games menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
            {gameCatalog.map((game) => (
              <DropdownMenuItem key={game.id} asChild>
                <Link to={game.route} className="w-full cursor-pointer">
                  {game.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
