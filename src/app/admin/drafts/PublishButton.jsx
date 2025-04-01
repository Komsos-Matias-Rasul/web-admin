"use client"

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

const handlePublish = async (articleId, r) => {
  try {
    const res = await fetch(`/api/articles/publish/${Number(articleId)}`, {
      method: 'POST',
    })
    if (res.status === 202) {
      r.back()
    }
  } catch (err) {
    console.error(err)
  }
}
export const PublishButton = ({rowId}) => {
  const r = useRouter()
  
  return <Button
    onPress={() => handlePublish(rowId, r)}
    title="Publish"
    size="sm"
    className="bg-emerald-500 text-white"
    startContent={<FaCheck size={15} />}
    isIconOnly />
}