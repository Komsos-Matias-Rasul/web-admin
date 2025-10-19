"use client"
import { useState, useEffect } from "react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/modal"
import {
  FiSettings,
  FiPlus,
  FiX,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi"
import { AddWriterModal } from "./AddWriterModal"

const handleSubmit = async (title, category, writer, id, setIsLoading, setMessage) => {
  if (!title || !category || !writer) {
    setMessage({ type: 'error', text: 'Please fill out all required fields' })
    return false
  }

  const reqData = {
    title,
    category: Number(category),
    writer: Number(category),
    id: Number(id)
  }

  setIsLoading(true)
  setMessage(null)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/saveTWC`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `Server error: ${res.status}`)
    }

    setMessage({ type: 'success', text: 'Article settings saved successfully!' })
    return true
  } catch (err) {
    console.error("Error saving article:", err)
    setMessage({ type: 'error', text: err.message || 'Failed to save article settings' })
    return false
  } finally {
    setIsLoading(false)
  }
}

export const SettingsModal = ({
  dataID,
  categories,
  writers: initialWriters,
  dataTitle,
  dataWriter,
  dataCategory,
  onSettingsSaved
}) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure()
  const {
    onOpen: onOpenAddWriter,
    onOpenChange: onOpenChangeAddWriter,
    isOpen: isOpenAddWriter
  } = useDisclosure()

  const [articleTitle, setTitle] = useState(dataTitle)
  const [selectedWriter, setSelectedWriter] = useState(dataWriter)
  const [selectedCategory, setSelectedCategory] = useState(dataCategory)

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [writers, setWriters] = useState(initialWriters || [])
  const [newWriterName, setNewWriterName] = useState("")
  const [isAddingWriter, setIsAddingWriter] = useState(false)
  const [addWriterError, setAddWriterError] = useState("")

  useEffect(() => {
    setTitle(dataTitle)
    setSelectedWriter(dataWriter)
    setSelectedCategory(dataCategory)
  }, [dataTitle, dataWriter, dataCategory])

  useEffect(() => {
    if (initialWriters) setWriters(initialWriters)
  }, [initialWriters])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleAddWriter = async () => {
    if (!newWriterName.trim()) {
      setAddWriterError("Please enter a writer name")
      return
    }

    setIsAddingWriter(true)
    setAddWriterError("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/writer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writer: newWriterName.trim() }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to add writer")

      if (data.success) {
        const newWriter = data.data
        setWriters(prev => [...prev, newWriter])
        setSelectedWriter(String(newWriter.id))
        setNewWriterName("")
        onOpenChangeAddWriter()
        setMessage({ type: 'success', text: 'Writer added successfully!' })
      }
    } catch (err) {
      setAddWriterError(err.message || "Failed to add writer")
    } finally {
      setIsAddingWriter(false)
    }
  }

  const handleCancelAddWriter = () => {
    setNewWriterName("")
    setAddWriterError("")
    onOpenChangeAddWriter()
  }

  const handleSaveSettings = async (onClose) => {
    const success = await handleSubmit(
      articleTitle,
      selectedCategory,
      selectedWriter,
      dataID,
      setIsLoading,
      setMessage
    )

    if (success) {
      if (onSettingsSaved) {
        onSettingsSaved({
          title: articleTitle,
          writer: selectedWriter,
          category: selectedCategory
        })
      }
      
      setTimeout(() => {
        onClose()
      }, 1000)
    }
  }

  const MessageAlert = ({ message }) => {
    if (!message) return null
    const isError = message.type === 'error'
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
      }`}>
        {isError ? <FiAlertCircle /> : <FiCheck />}
        <span className="text-sm">{message.text}</span>
      </div>
    )
  }

  return (
    <>
      <Button onPress={onOpen} startContent={<FiSettings />}>Settings</Button>

      <Modal
        isDismissable={!isLoading}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Article Settings</ModalHeader>
              <form onSubmit={(e) => e.preventDefault()}>
                <ModalBody className="space-y-4">
                  <MessageAlert message={message} />

                  <Input
                    label="Title"
                    value={articleTitle}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (message) setMessage(null)
                    }}
                    isDisabled={isLoading}
                    isRequired
                  />

                  <div>
                    <label className="block font-medium mb-2">Writer *</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedWriter}
                        onChange={(e) => {
                          setSelectedWriter(e.target.value)
                          if (message) setMessage(null)
                        }}
                        disabled={isLoading}
                        className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Select a writer</option>
                        {writers.map((writer) => (
                          <option key={writer.id} value={writer.id}>
                            {writer.writer_name}
                          </option>
                        ))}
                      </select>
                      <AddWriterModal />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Category *</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        if (message) setMessage(null)
                      }}
                      disabled={isLoading}
                      className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    color="default"
                    variant="light"
                    onPress={onClose}
                    isDisabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => handleSaveSettings(onClose)}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
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