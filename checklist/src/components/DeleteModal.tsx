import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { removeItem } from "@src/utils/api";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback } from "react";
interface DeleteModalProps {
  listId: number;
}

function DeleteModal({ listId }: DeleteModalProps) {
  const itemIdToDelete = useChecklistStore((state) => state.itemIdToDelete);
  const setItemIdToDelete = useChecklistStore((state) => state.setItemIdToDelete);

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => {
      return removeItem(listId, itemId);
    },
  });
  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(0);
    await removeItemMutation.mutateAsync(itemIdToDelete);
  }, [itemIdToDelete, removeItemMutation, setItemIdToDelete]);

  return (
    <>
      <Modal isOpen={!!itemIdToDelete} onClose={() => setItemIdToDelete(0)}>
        <ModalOverlay backdropFilter="blur(1px)" />
        <ModalContent bgColor="gray.700">
          <ModalHeader>Suppression d'un article</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Êtes vous sùr de vouloir supprimer cet article ?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
              Oui
            </Button>
            <Button onClick={() => setItemIdToDelete(0)}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default memo(DeleteModal);
