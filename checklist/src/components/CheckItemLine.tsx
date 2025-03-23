import { updateItem } from "@src/utils/api";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import eventMgr, { EventType } from "@src/utils/eventMgr";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaRegTrashAlt } from "react-icons/fa";
import { ChecklistItem, ChecklistItemInput } from "../../../common/checklistTypes";
import CheckBoxInput from "./CheckBoxInput";
import "./CheckItemLine.scss";
import ValidatedInput from "./ValidatedInput";

type CheckItemLineProps = Pick<ChecklistItem, "id" | "checked" | "title" | "sortOrder"> & {
  isNewItem?: boolean;
  listId: number;
};

function CheckItemLine({ id, checked, title, sortOrder, isNewItem, listId }: CheckItemLineProps) {
  const [isItemChecked, setIsItemChecked] = useState(!!checked);
  const cardRef = useRef<HTMLDivElement>(null);
  const setItemIdToDelete = useChecklistStore((state) => state.setItemIdToDelete);

  const updateItemMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistItemInput>) => {
      return updateItem(listId, id, checklistCategoryInput);
    },
  });

  const handleCheckSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    // Want to update the local state immediately
    setIsItemChecked(event.target.checked);
    console.log("event.target.checked", event.target.checked);
    setTimeout(() => {
      updateItemMutation.mutateAsync({
        checked: event.target.checked ? 1 : 0,
      });
    }, 0);
  };

  useEffect(() => {
    // reset to the remote state when changed
    setIsItemChecked(!!checked);
  }, [checked]);

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateItemMutation.mutateAsync({
        title: value,
      });
    },

    [updateItemMutation]
  );

  useEffect(() => {
    if (isNewItem) {
      cardRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isNewItem]);

  const [hasMoved, setHasMoved] = useState(false);
  const prevSortOrderRef = useRef<number>(0);

  useEffect(() => {
    let tt: number = 0;
    if (prevSortOrderRef.current && sortOrder && sortOrder !== prevSortOrderRef.current) {
      setHasMoved(true);
      tt = window.setTimeout(() => {
        setHasMoved(false);
      }, 5000);
    }
    prevSortOrderRef.current = sortOrder;

    return () => {
      clearTimeout(tt);
    };
  }, [sortOrder]);

  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(id);
  }, [id, setItemIdToDelete]);

  const handleUpClick = useCallback(async () => {
    eventMgr.dispatch(EventType.MoveItem, { id, isUp: true });
  }, [id]);

  const handleDownClick = useCallback(async () => {
    eventMgr.dispatch(EventType.MoveItem, { id, isUp: false });
  }, [id]);

  return (
    <div
      ref={cardRef}
      className={`checklist-line ${isItemChecked ? "checked" : ""} ${isNewItem || hasMoved ? "moved" : ""}`}
    >
      <div className="checklist-line-inner">
        <div className="checklist-line-left">
          <CheckBoxInput checked={isItemChecked} onChange={handleCheckSwitch} />
          <ValidatedInput placeholder="Entrez un titre" onValidated={handleTitleInputValidated} remoteValue={title} />
        </div>

        <div className="checklist-line-right">
          <div className="icon-button" onClick={handleUpClick}>
            <FaArrowAltCircleUp />
          </div>
          <div className="icon-button" onClick={handleDownClick}>
            <FaArrowAltCircleDown />
          </div>
          <div className="icon-button icon-button-danger" onClick={handleDeleteClick}>
            <FaRegTrashAlt />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CheckItemLine);
