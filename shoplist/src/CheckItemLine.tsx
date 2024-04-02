import { Box, Card, CardBody, Stack, Switch } from "@chakra-ui/react";
import { CheckListItem } from "./types";

interface CheckItemLineProps {
  checkItem: CheckListItem;
}

export default function CheckItemLine({ checkItem }: CheckItemLineProps) {
  return (
    <Card m="1">
      <CardBody p={2}>
        <Stack direction="row" spacing={1}>
          <Box w={50}>
            <Switch isChecked={!!checkItem.checkStatus} />
          </Box>
          <Box w={200}>{checkItem.title}</Box>{" "}
          <Box flexGrow={1}>{checkItem.subtitle}</Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
