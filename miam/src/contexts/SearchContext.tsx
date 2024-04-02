import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export const SearchContext = createContext<{
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}>({ searchText: "", setSearchText: () => {} });

export const SearchContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchText, setSearchText] = useState("");

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
};
