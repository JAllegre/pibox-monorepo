import { Paths } from "@src/lib/constants";
import { Utensils } from "lucide-react";
import { ChangeEvent, useCallback, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";
import { Input } from "./ui/input";

export default function Navbar() {
  const { searchText, setSearchText } = useContext(SearchContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChangeSearchText = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setSearchText(evt.target.value);
      if (pathname !== Paths.Recipes) {
        navigate(Paths.Recipes);
      }
    },
    [navigate, pathname, setSearchText]
  );

  const handleLogoClick = useCallback(() => {
    setSearchText("");
  }, [setSearchText]);

  return (
    <nav className="fixed px-3 md:max-w-2xl m-auto top-0 left-0 right-0 p-1 h-[--nav-height] z-10 flex items-center justify-between bg-white shadow-[0_4px_6px_-4px_gray]">
      <Link to={Paths.Recipes} onClick={handleLogoClick}>
        <div className="flex items-center justify-start">
          <Utensils size="18" strokeWidth="3" className="text-primary-700" />
          <div className="font-bold text-2xl pl-2 text-primary-700">
            miam miam
          </div>
        </div>
      </Link>

      <div>
        <Input
          id="search"
          type="search"
          placeholder="Rechercher une recette"
          value={searchText}
          onChange={handleChangeSearchText}
          className="w-[190px]"
        />
      </div>
    </nav>
  );
}
