import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import MyIconButton from "./MyIconButton";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchFilter = useChecklistStore((state) => state.setSearchFilter);

  const handleSearchFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  const handleSearchFilterClear = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  useEffect(() => {
    const tt = setTimeout(() => {
      setSearchFilter(searchTerm);
    }, 800);

    return () => {
      clearTimeout(tt);
    };
  }, [searchTerm, setSearchFilter]);

  return (
    <InputGroup w={200}>
      <Input
        placeholder="Filtrer..."
        color="teal.200"
        value={searchTerm}
        onChange={handleSearchFilterChange}
        maxW={200}
        pl={2}
      />
      <InputRightElement {...(!searchTerm && { pointerEvents: "none" })}>
        {searchTerm ? (
          <MyIconButton ReactIcon={ImCross} onClick={handleSearchFilterClear} />
        ) : (
          <MyIconButton ReactIcon={FaMagnifyingGlass} onClick={() => {}} />
        )}
      </InputRightElement>
    </InputGroup>
  );
}

export default memo(SearchInput);
