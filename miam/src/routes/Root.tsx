import bg from "@src/assets/bg.jpg";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SearchContextProvider } from "../contexts/SearchContext";

export default function Root() {
  return (
    <>
      <div
        className={`text-slate-800 dark:text-slate-300 max-w-[100vw] relative`}
      >
        <img
          src={bg}
          width={500}
          height={500}
          alt="background image"
          className="fixed h-full w-full opacity-60 object-cover"
        />

        <SearchContextProvider>
          <div className="w-full md:max-w-2xl m-auto bg-[#FFFFFFEE] relative">
            <Navbar />
            <div className="pl-4 pr-2 pt-[--nav-height] pb-[--footer-height] px-0">
              <Outlet />
            </div>
          </div>
        </SearchContextProvider>
      </div>
    </>
  );
}
