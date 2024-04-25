import { HStack, Input, InputGroup, InputLeftElement, Switch, Text } from "@chakra-ui/react";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { ChangeEvent, useCallback } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function BottomBar() {
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);
  const setDisplayMode = useChecklistStore((state) => state.setDisplayMode);
  const searchFilter = useChecklistStore((state) => state.searchFilter);
  const setSearchFilter = useChecklistStore((state) => state.setSearchFilter);

  const handleDisplayModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayMode(event.target.checked ? DisplayMode.Edit : DisplayMode.View);
    },
    [setDisplayMode],
  );

  const handleSearchFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchFilter(event.target.value);
    },
    [setSearchFilter],
  );

  return (
    <HStack pos="fixed" w="100%" maxW="2xl" bottom={0} p={2} bgColor="gray.700" gap={5} justify={"space-between"}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaMagnifyingGlass />
        </InputLeftElement>
        <Input
          placeholder="Filtrer"
          color="teal.200"
          w="auto"
          value={searchFilter}
          onChange={handleSearchFilterChange}
          maxW={200}
        />
      </InputGroup>

      <HStack justifyContent="space-between">
        <Text>Edition:</Text>
        <Switch size="lg" isChecked={isEditMode} onChange={handleDisplayModeChange} />
      </HStack>
    </HStack>
  );
}
