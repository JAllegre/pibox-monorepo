import { useQuery } from "@tanstack/react-query";
import CheckCategoryPanel from "./CheckCategoryPanel";
import { getCheckList } from "./lib/api";
import { FC } from "react";
import MyReactQuerySuspense from "./utils/MyReactQuerySuspense";

const CheckListPanel: FC = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["getCheckList"],
    queryFn: getCheckList,
  });

  const checkList = data?.checkList;

  return (
    <div>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <ul>
          {checkList?.categories.map((checkListCategory) => (
            <CheckCategoryPanel
              key={checkListCategory.id}
              checkListCategory={checkListCategory}
            />
          ))}
        </ul>
      </MyReactQuerySuspense>
    </div>
  );
};
export default CheckListPanel;
