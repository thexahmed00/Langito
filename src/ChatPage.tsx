import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input"
import { ChatMessage, fetchOpenAIResponse } from "@/lib/openai"
import { useState } from "react"

interface Message {
  id: number
  message: string
  sender: "user" | "bot"
}

const ChatPage = ({selectedLanguage}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: `Hi! I'm your language learning assistant. How can I help you with ${selectedLanguage} today?`,
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      message: input,
      sender: "user",
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const chatHistory:ChatMessage[] = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message
      }))

      const systemPrompt: ChatMessage = {
        role: "system" as const,
        content: `You are a professional language tutor. Follow these rules:
        1. Keep responses concise and focused
        2. Break down complex explanations into smaller parts
        3. Use clear formatting with bold for important terms
        4. Always provide 2-3 example sentences
        5. Limit responses to 150 words
        6. When listing items, show only 5-7 at a time
        7. For alphabets or characters, include pronunciation guides in parentheses
        8. End each response with a simple practice question`
      }

      const getLearningContext = (selectedLanguage: string) => {
        return {
          role: "system" as const,
          content: `Focus on ${selectedLanguage} at beginner level. 
          Current learning goal: basic conversation and essential vocabulary.`
        };
      };

      const aiResponse = await fetchOpenAIResponse([
        systemPrompt,
        getLearningContext(selectedLanguage),
        ...chatHistory,
        { role: "user", content: input }
      ])

      const botMessage: Message = {
        id: messages.length + 2,
        message: aiResponse?.trim() || "Sorry, I didn't understand that. Can you please rephrase?",
        sender: "bot",
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        message: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} variant={msg.sender === "user" ? "sent" : "received"}>
            <ChatBubbleAvatar
              fallback={msg.sender === "user" ? "US" : "AI"}
              src={msg.sender === "user" ? "/assets/user-avatar.png" : "/assets/ai-avatar.png"}
            />
            <ChatBubbleMessage isLoading={msg.sender === "bot" && isLoading && msg.id === messages.length}>
              {msg.message}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </div>

      <div className="p-4 border-t">
        <ChatInput
          variant="default"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSend}
          loading={isLoading}
          onStop={() => setIsLoading(false)}
        >
          <ChatInputTextArea placeholder="Type your message..." />
          <ChatInputSubmit />
        </ChatInput>
      </div>
    </div>
  )
}

export default ChatPage