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
import eventMgr from "@src/utils/eventMgr";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export function DeleteModal() {
  const itemIdToDelete = useChecklistStore((state) => state.itemIdToDelete);
  const setItemIdToDelete = useChecklistStore((state) => state.setItemIdToDelete);
  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => {
      return removeItem(itemId);
    },
  });
  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(0);
    await removeItemMutation.mutateAsync(itemIdToDelete);
    eventMgr.dispatch("checklist-refresh");
  }, [itemIdToDelete, removeItemMutation, setItemIdToDelete]);

  return (
    <>
      <Modal isOpen={!!itemIdToDelete} onClose={() => setItemIdToDelete(0)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attention</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Vous êtes sur de vouloir supprimer cet élément ?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDeleteClick}>
              OUI
            </Button>
            <Button variant="ghost" onClick={() => setItemIdToDelete(0)}>
              ANNULER
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
