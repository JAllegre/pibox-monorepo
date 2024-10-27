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
import { removeCategory } from "@src/utils/api";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback } from "react";
interface DeleteCategoryModalProps {
  listId: number;
  categoryId: number;
  onClose: () => void;
}

function DeleteCategoryModal({ listId, categoryId, onClose }: DeleteCategoryModalProps) {
  const { mutateAsync, error } = useMutation({
    mutationFn: ({ listId, categoryId }: { listId: number; categoryId: number }) => {
      return removeCategory(listId, categoryId);
    },
  });

  const handleDeleteClick = useCallback(async () => {
    await mutateAsync({ listId, categoryId });
    onClose();
  }, [categoryId, listId, mutateAsync, onClose]);

  return (
    <>
      <Modal isOpen={!!(listId && categoryId)} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(1px)" />
        <ModalContent bgColor="gray.700">
          <ModalHeader>Suppression d'une catégorie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{error?.message ? error.message : "Êtes vous sùr de vouloir supprimer cet catégorie ?"}</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
              Oui
            </Button>
            <Button onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default memo(DeleteCategoryModal);
