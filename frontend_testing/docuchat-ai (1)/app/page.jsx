"use client"

import { useState } from "react"
import UploadForm from "@/components/upload-form"
import ChatWindow from "@/components/chat-window"

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isFileProcessed, setIsFileProcessed] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (file) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual API call
      console.log("Uploading file:", file.name)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUploadedFile(file)
      setIsFileProcessed(true)

      // Add welcome message
      setMessages([
        {
          role: "assistant",
          content: `I've processed "${file.name}". Ask me anything about this document!`,
        },
      ])
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return

    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: message }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // This would be replaced with actual API call
      console.log("Sending message:", message)

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add bot response
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `This is a simulated response to your question about the document "${uploadedFile?.name}".`,
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">DocuChat AI</h1>
          <p className="text-gray-600">Upload a PDF and chat with its contents</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadForm onUpload={handleUpload} uploadedFile={uploadedFile} isLoading={isLoading} />

          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isEnabled={isFileProcessed}
          />
        </div>
      </div>
    </main>
  )
}
