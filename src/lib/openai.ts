import OpenAI from "openai"

const openai = new OpenAI({
  apiKey:'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',
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
      console.log("OpenAI response:", content)
      return content
  } catch (error) {
    console.error("Error fetching OpenAI response:", error)
    throw error
  }
}