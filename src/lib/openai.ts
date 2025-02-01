import OpenAI from "openai"
import axios from "axios"

// const openai = new OpenAI({
//   apiKey: "2g5pUCgt8zoCa9Q0dKOdqjXbD4SAsNQJUhJ3Vgsg46gSN2CqXUFXJQQJ99BBACYeBjFXJ3w3AAABACOGx2h9",
//   dangerouslyAllowBrowser: true,
// })

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const fetchOpenAIResponse = async (prompt:ChatMessage[]) => {
  //add system prompt 
console.log(import.meta.env.VITE_AZURE_OPENAI_ENDPOINT);
  try{
    const result = await axios.post(
      import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
      {
        messages: prompt,
        max_tokens: 150,
        temperature: 0.6,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.VITE_AZURE_OPENAI_KEY,
        },
      }
    );
    console.log(result)
    return result.data.choices[0].message.content
  } catch (error) {
    console.error("Error fetching OpenAI response:", error)
    throw error
  }
  
  // try {
  //   const response = await openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: prompt,
  //       max_tokens: 150,
  //       temperature: 0.6, // Controls randomness (0-1)
  //       presence_penalty: 0.6, // Encourages new topics
  //       frequency_penalty: 0.5 // Reduces repetition
  //     });
  //     const content = response.choices[0].message.content;
  //     return content
  // } catch (error) {
  //   console.error("Error fetching OpenAI response:", error)
  //   throw error
  // }
}