import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { ChangeEvent, memo, useCallback } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import MyIconButton from "./MyIconButton";

function SearchInput() {
  //const [searchTerm, setSearchTerm] = useState("");
  const setSearchFilter = useChecklistStore((state) => state.setSearchFilter);
  const searchFilter = useChecklistStore((state) => state.searchFilter);

  const handleSearchFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchFilter(event.target.value);
    },
    [setSearchFilter]
  );

  const handleSearchFilterClear = useCallback(() => {
    setSearchFilter("");
  }, [setSearchFilter]);

  return (
    <InputGroup w={200}>
      <Input
        placeholder="Filtrer..."
        color="teal.200"
        value={searchFilter}
        onChange={handleSearchFilterChange}
        maxW={200}
        pl={2}
      />
      <InputRightElement {...(!searchFilter && { pointerEvents: "none" })}>
        {searchFilter ? (
          <MyIconButton ReactIcon={ImCross} onClick={handleSearchFilterClear} style={{ padding: "15px" }} />
        ) : (
          <MyIconButton ReactIcon={FaMagnifyingGlass} onClick={undefined} />
        )}
      </InputRightElement>
    </InputGroup>
  );
}

export default memo(SearchInput);
