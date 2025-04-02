"use client"

import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import { FiSettings } from "react-icons/fi"

export const SettingsModal = () => {
  const {onOpen, onOpenChange, isOpen} = useDisclosure()
  return (
    <>
      <Button onPress={onOpen} startContent={<FiSettings />}>Settings</Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Settings</ModalHeader>
                <form>
                  <ModalBody>
                    <Input label="title"/>
                    <Input label="writer"/>
                    <Input label="category"/>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="reset" color="default" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" onPress={onClose}>
                      Save
                    </Button>
                  </ModalFooter>
                </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}