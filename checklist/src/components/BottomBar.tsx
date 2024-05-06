import { HStack, Input, InputGroup, InputLeftElement, InputRightElement, Switch, Text } from "@chakra-ui/react";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { MyIconButton } from "./MyIconButton";

export default function BottomBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);
  const setDisplayMode = useChecklistStore((state) => state.setDisplayMode);
  const setSearchFilter = useChecklistStore((state) => state.setSearchFilter);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const handleDisplayModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayMode(event.target.checked ? DisplayMode.Edit : DisplayMode.View);
    },
    [setDisplayMode]
  );

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
    <HStack
      className="bottom-bar"
      pos="fixed"
      w="100%"
      maxW="2xl"
      bottom={0}
      p={2}
      bgColor="gray.700"
      gap={5}
      justify={"space-between"}
    >
      <InputGroup w="auto">
        <InputLeftElement pointerEvents="none">
          <FaMagnifyingGlass />
        </InputLeftElement>
        <Input
          placeholder="Filtrer"
          color="teal.200"
          value={searchTerm}
          onChange={handleSearchFilterChange}
          maxW={200}
        />
        <InputRightElement>
          <MyIconButton
            ReactIcon={ImCross}
            color="red.200"
            display={searchTerm ? "" : "none"}
            onClick={handleSearchFilterClear}
          />
        </InputRightElement>
      </InputGroup>

      <HStack justifyContent="space-between">
        <Text>Edition:</Text>
        <Switch size="lg" isChecked={isEditMode} onChange={handleDisplayModeChange} />
      </HStack>
    </HStack>
  );
}
