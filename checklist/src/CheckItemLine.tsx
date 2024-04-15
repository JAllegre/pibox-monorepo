import { Box, Card, CardBody, Stack, Switch } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { ChecklistItem, ChecklistItemInput } from "../../common/checklistTypes";
import { updateItem } from "./lib/api";

interface CheckItemLineProps {
  checkItem: ChecklistItem;
}

export default function CheckItemLine({ checkItem }: CheckItemLineProps) {
  // const [checked, setChecked] = useState<boolean>(!!checkItem.checkStatus);

  const updateItemMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistItemInput>) => {
      return updateItem(checkItem.id, checklistCategoryInput);
    },
  });

  const hanCheckSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    updateItemMutation.mutate({ checkStatus: event.target.checked ? 2 : 0 });
    //setChecked(event.target.checked);
  };
  return (
    <Card m="1">
      <CardBody p={2}>
        <Stack direction="row" spacing={1}>
          <Box w={50}>
            <span>checkItem.checkStatus: {checkItem.checkStatus}</span>
            <Switch
              isChecked={!!checkItem.checkStatus}
              onChange={hanCheckSwitch}
            />
          </Box>
          <Box w={200}>{checkItem.title}</Box>{" "}
          <Box flexGrow={1}>{checkItem.subtitle}</Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
