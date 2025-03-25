"use client"

import { createArticle } from "@/actions/articles"
import { Button } from "@heroui/button"
import { useRouter } from "next/navigation"

export const WriteArticleButton = ({ editionId }) => {
  const r = useRouter()
  const handleNewArticle = async () => {
    try {
      const articleId = await createArticle(editionId)
      r.push(`/admin/editor/${articleId}`)
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <Button onPress={() => handleNewArticle(editionId)}>Write New Article</Button>
  )
}