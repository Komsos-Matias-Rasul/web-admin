"use client"

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";

export const ConfirmModal = ({ title, buttonTitle, buttonColor="primary", onOpenChange, isOpen, submitAction, children }) => {
  const handlePublish = async (e) => {
    e.preventDefault();
    try{
      submitAction()
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{title}</ModalHeader>
                <form onSubmit={handlePublish}>
                  <ModalBody>
                    { children }
                  </ModalBody>
                  <ModalFooter>
                    <Button type="reset" color="default" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" color={buttonColor} onPress={onClose}>
                      {buttonTitle}
                    </Button>
                  </ModalFooter>
                </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}