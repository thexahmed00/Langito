import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const fetchOpenAIResponse = async (prompt:ChatMessage[]) => {
  //add system prompt 
  
  try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: prompt,
        max_tokens: 150,
        temperature: 0.6, // Controls randomness (0-1)
        presence_penalty: 0.6, // Encourages new topics
        frequency_penalty: 0.5 // Reduces repetition
      });
      const content = response.choices[0].message.content;
      return content
  } catch (error) {
    console.error("Error fetching OpenAI response:", error)
    throw error
  }
}