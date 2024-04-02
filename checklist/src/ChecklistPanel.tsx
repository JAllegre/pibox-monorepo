import { useQuery } from "@tanstack/react-query";
import CheckCategoryPanel from "./CheckCategoryPanel";
import { getChecklist } from "./lib/api";
import { FC } from "react";
import MyReactQuerySuspense from "./utils/MyReactQuerySuspense";

const ChecklistPanel: FC = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["getChecklist"],
    queryFn: getChecklist,
  });

  const checklist = data?.checklist;

  return (
    <div>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <ul>
          {checklist?.categories.map((checklistCategory) => (
            <CheckCategoryPanel
              key={checklistCategory.id}
              checklistCategory={checklistCategory}
            />
          ))}
        </ul>
      </MyReactQuerySuspense>
    </div>
  );
};
export default ChecklistPanel;
