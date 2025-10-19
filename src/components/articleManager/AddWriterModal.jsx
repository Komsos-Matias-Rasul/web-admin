"use client"

import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import { CircularProgress } from "@heroui/progress"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"

export const AddWriterModal = () => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure()
  const [writerName, setWriterName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = () => {
    setWriterName("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/writer`, {
        method: "POST",
        body: JSON.stringify({"writer": writerName})
      })
      setIsLoading(false)
      if (!res.ok) {
        throw Error(res.statusText)
      }
      setWriterName("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        onPress={onOpen}
        startContent={<FiPlus size={16} />}
        className="px-3"
        >
        Add
      </Button>
    
      <Modal
        size="sm"
        isDismissable={!isLoading}
        isOpen={isOpen}
        onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  <FiPlus />
                  Add New Writer
                </ModalHeader>

                <form onReset={handleReset} onSubmit={handleSubmit}>
                  <ModalBody>
                    <Input
                      label="Writer Name"
                      placeholder="Komsos Samara"
                      value={writerName}
                      onValueChange={setWriterName}
                      isDisabled={isLoading}
                      autoFocus
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="reset"
                      color="danger"
                      variant="light"
                      isDisabled={isLoading}
                      onPress={onClose}
                      >
                      Cancel
                    </Button>
                    <Button isDisabled={isLoading} type="submit" color="primary">
                      {
                        isLoading ? 
                        <CircularProgress aria-label="Loading..." color="default" />
                        : "Submit"
                      }
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
      </Modal>
    </>
)}