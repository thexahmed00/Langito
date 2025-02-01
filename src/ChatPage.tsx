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

interface ChatPageProps {
  selectedLanguage: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ selectedLanguage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: `Hi! I'm your language learning assistant. How can I help you with ${selectedLanguage} today?`,
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [showThankYouDialog, setShowThankYouDialog] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    if (userMessageCount >= 5) {
      setShowThankYouDialog(true);
      
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      message: input,
      sender: "user",
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setUserMessageCount(prev => prev + 1);

    try {
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message
      }))

      const systemPrompt: ChatMessage = {
        role: "system" as const,
        content: `You are a friendly and supportive language tutor. Your goal is to help users learn ${selectedLanguage} in a fun and engaging way. 
        Follow these guidelines:
        1. Keep responses clear and concise.
        2. Break down complex explanations into simple parts.
        3. Use friendly language and encourage users to ask questions.
        4. Provide 2-3 example sentences for clarity.
        5. Limit responses to 150 words to keep it digestible.
        6. When listing items, show only 5-7 at a time.
        7. For alphabets or characters, include pronunciation guides in parentheses (e.g., "a" as in "car").
        8. End each response with a simple practice question to encourage interaction.`
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

      const cleanedResponse = aiResponse.replace(/\*\*/g, '').trim();

      const botMessage: Message = {
        id: messages.length + 2,
        message: cleanedResponse || "Sorry, I didn't understand that. Can you please rephrase?",
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

      {showThankYouDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Thank You!</h2>
            <p>This is a free trial version of Muss AI. You can continue learning by subscribing to our paid plan in the future Inshallah !! .</p>
            <p>Bye! Bye!! you can continue your now :).</p>
            <button
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
              onClick={() => setShowThankYouDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage