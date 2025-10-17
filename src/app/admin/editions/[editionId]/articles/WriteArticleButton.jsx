"use client"

import { Button } from "@heroui/button"
import { useRouter } from "next/navigation"

export const WriteArticleButton = ({ editionId }) => {
  const r = useRouter()
  const handleNewArticle = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/create/${editionId}`,
        {
          method: "POST"
        })
      const jsonData = await res.json()
      const articleId = jsonData.data.article_id
      r.push(`/admin/editor/${articleId}`)
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <Button onPress={handleNewArticle}>Write New Article</Button>
  )
}