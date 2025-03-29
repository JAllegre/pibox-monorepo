import { removeCategory } from "@src/utils/api";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import SimpleModalDialog from "./SimpleModalDialog";
interface DeleteCategoryModalProps {
  listId: number;
}

function DeleteCategoryModal({ listId }: DeleteCategoryModalProps) {
  const categoryIdToDelete = useChecklistStore((state) => state.categoryIdToDelete);
  const setCategoryIdToDelete = useChecklistStore((state) => state.setCategoryIdToDelete);

  const { mutateAsync, error } = useMutation({
    mutationFn: ({ listId, categoryId }: { listId: number; categoryId: number }) => {
      return removeCategory(listId, categoryId);
    },
  });

  const handleConfirmModal = useCallback(async () => {
    await mutateAsync({ listId, categoryId: categoryIdToDelete });
    setCategoryIdToDelete(0);
  }, [categoryIdToDelete, listId, mutateAsync, setCategoryIdToDelete]);

  const handleCloseModal = useCallback(() => {
    setCategoryIdToDelete(0);
  }, [setCategoryIdToDelete]);

  return (
    <SimpleModalDialog
      isOpen={!!(listId && categoryIdToDelete)}
      title={"Suppression d'une catégorie"}
      body={error?.message ? error.message : "Êtes vous sùr de vouloir supprimer cette catégorie ?"}
      onConfirm={handleConfirmModal}
      onClose={handleCloseModal}
    />
  );
}

export default memo(DeleteCategoryModal);
