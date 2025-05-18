export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`py-2 px-4 rounded-lg max-w-[80%] ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  )
}
