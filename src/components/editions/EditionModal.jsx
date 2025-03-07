"use client"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { useState } from "react"
import ThumbnailUploader from "../ThumbnailUploader"
import { createNewEditionHandler, updateEditionInfoHandler } from "@/actions/edition"
import { AiFillEdit } from "react-icons/ai"

const createNewEdition = async (editionData) => {
  try{
    const res = await createNewEditionHandler(editionData)
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

const updateEditionInfo = async (editionData) => {
  try{
    const res = await updateEditionInfoHandler(editionData)
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}


// TODO: Add confirmation modal 
export const NewEditionModal = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const [editionTitle, setEditionTitle] = useState()
  const [editionYear, setEditionYear] = useState()
  const [coverImg, setCoverImg] = useState()
  const handleReset = () => {
    setCoverImg(null)
    setEditionTitle("")
    setEditionYear("")
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    createNewEdition({editionTitle, editionYear, coverImg})
    setCoverImg(null)
    setEditionTitle("")
    setEditionYear("")
  }
  return (
    <>
      <Button radius="sm" onPress={onOpen}>Create New Edition</Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Edition Info</ModalHeader>
              <form onReset={handleReset} onSubmit={handleSubmit}>
                <ModalBody>
                    <Input value={editionTitle} onValueChange={setEditionTitle} label="title" />
                    <Input type="number" value={editionYear} onValueChange={setEditionYear} label="edition year" />
                    <ThumbnailUploader thumbnail={coverImg} setThumbnail={setCoverImg} />
                </ModalBody>
                <ModalFooter>
                  <Button type="reset" color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Submit
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


// TODO: Add confirmation modal
export const EditEditionInfoModal = ({ data }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const [editionTitle, setEditionTitle] = useState(data.editionTitle || "")
  const [editionYear, setEditionYear] = useState(data.editionYear || "")
  const [coverImg, setCoverImg] = useState(data.coverImg)
  const handleReset = () => {
    setCoverImg(null)
    setEditionTitle("")
    setEditionYear("")
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    updateEditionInfo({
      editionTitle,
      editionYear,
      coverImg,
      editionId: data.rowId
    })
    setCoverImg(null)
    setEditionTitle("")
    setEditionYear("")
  }
  return (
    <>
      <Button onPress={onOpen} title="Update Info" isIconOnly size="sm" className="bg-amber-500 text-white" startContent={<AiFillEdit size={15} />} />
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
            
              <ModalHeader className="flex flex-col gap-1">Create New Edition</ModalHeader>
              <form onReset={handleReset} onSubmit={handleSubmit}>
                <ModalBody>
                    <Input value={editionTitle} onValueChange={setEditionTitle} label="title" />
                    <Input type="number" value={editionYear} onValueChange={setEditionYear} label="edition year" />
                    <ThumbnailUploader thumbnail={coverImg} setThumbnail={setCoverImg} />
                </ModalBody>
                <ModalFooter>
                  <Button type="reset" color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Submit
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