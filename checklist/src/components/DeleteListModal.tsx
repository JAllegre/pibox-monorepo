import { removeList } from "@src/utils/api";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation } from "@tanstack/react-query";
import { FC, memo, useCallback } from "react";
import SimpleModalDialog from "./SimpleModalDialog";

const DeleteListModal: FC = () => {
  const listIdToDelete = useChecklistStore((state) => state.listIdToDelete);
  const setListIdToDelete = useChecklistStore((state) => state.setListIdToDelete);

  const { mutateAsync, error } = useMutation({
    mutationFn: ({ listId }: { listId: number }) => {
      return removeList(listId);
    },
  });

  const handleConfirmModal = useCallback(async () => {
    await mutateAsync({ listId: listIdToDelete });
    setListIdToDelete(0);
  }, [listIdToDelete, mutateAsync, setListIdToDelete]);

  const handleCloseModal = useCallback(() => {
    setListIdToDelete(0);
  }, [setListIdToDelete]);

  return (
    <SimpleModalDialog
      isOpen={!!listIdToDelete}
      title={"Suppression d'une liste"}
      body={error?.message ? error.message : "Êtes vous sùr de vouloir supprimer cette liste ?"}
      onConfirm={handleConfirmModal}
      onClose={handleCloseModal}
    />
  );
};

export default memo(DeleteListModal);
