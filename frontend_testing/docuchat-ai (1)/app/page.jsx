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
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadedFile(file)
        setIsFileProcessed(true)
        setMessages([
          {
            role: "assistant",
            content: `I've processed "${file.name}". Ask me anything about this document!`,
          },
        ])
      } else {
        console.error("Upload failed", data)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading || !uploadedFile) return

    const newMessages = [...messages, { role: "user", content: message }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: uploadedFile.name,
          question: message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.answer || "No response received.",
          },
        ])
      } else {
        console.error("Chat request failed", data)
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Error processing your request. Please check the console.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    const confirmReset = window.confirm("Start a new chat? This will clear your uploaded file and messages.")
    if (confirmReset) {
      setUploadedFile(null)
      setIsFileProcessed(false)
      setMessages([])
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800">DocuChat AI</h1>
          <p className="text-gray-600">Upload a PDF and chat with its contents</p>
        </header>

        {/* New Chat Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleNewChat}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
            disabled={isLoading}
          >
            + New Chat
          </button>
        </div>

        {/* Upload + Chat Interface */}
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
