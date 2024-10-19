import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import MyIconButton from "./MyIconButton";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchFilter = useChecklistStore((state) => state.setSearchFilter);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

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
    const searchHN = async () => {
      setSearchFilter(debouncedSearchTerm);
    };

    searchHN();
  }, [debouncedSearchTerm, setSearchFilter]);

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
          <MyIconButton
            ReactIcon={ImCross}
            color="red.200"
            // display={searchTerm ? "" : "none"}
            onClick={handleSearchFilterClear}
          />
        ) : (
          <MyIconButton
            ReactIcon={FaMagnifyingGlass}
            // display={searchTerm ? "" : "none"}
            onClick={() => {}}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
}

export default memo(SearchInput);
