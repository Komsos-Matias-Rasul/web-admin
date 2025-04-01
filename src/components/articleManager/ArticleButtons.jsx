"use client"

import { Button } from "@heroui/button"
import { ConfirmModal } from "../ConfirmationModal"
import { useDisclosure } from "@heroui/modal"
import { useRouter } from "next/navigation"

const handleArchive = async (articleId, r) => {
  try {
    await fetch(`/api/articles/archive/${articleId}`, {
      method: 'DELETE',
    })
    r.back()
  }
  catch (err) {
    console.error(err)
  }
}


const handleDelete = async (articleId, r) => {
  try {
    await fetch(`/api/articles/delete/${articleId}`, {
      method: 'DELETE',
    })
    r.back()
  } catch (err) {
    console.error(err)
  }
}

export const ArchiveArticleButton = ({articleId}) => {
  const {isOpen, onOpenChange, onOpen} = useDisclosure()
  const r = useRouter()
  return (
    <>
      <Button onPress={onOpen} color="danger">Archive</Button>
      <ConfirmModal
        buttonColor="danger"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        buttonTitle="Yes, Archive"
        submitAction={() => handleArchive(articleId, r)}
        title="Archive Article">
        <p>By pressing &quot;Yes, Archive&quot; this article will be archived and will not show neither in draft nor public.</p>
      </ConfirmModal>
    </>
  )
}

export const DeleteArticleButton = ({ articleId }) => {
  const {isOpen, onOpenChange, onOpen} = useDisclosure()
  const r = useRouter()
  
  return (
    <>
      <Button onPress={onOpen} color="danger">Delete</Button>
      <ConfirmModal
        buttonColor="danger"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        buttonTitle="Yes, Delete"
        submitAction={() => handleDelete(articleId, r)}
        title="Delete Article">
        <p>By pressing &quot;Yes, Delete&quot; this article will be deleted permanently can not be undone.</p>
      </ConfirmModal>
    </>
  )

}