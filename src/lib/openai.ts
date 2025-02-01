
import axios from "axios"


export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const fetchOpenAIResponse = async (prompt:ChatMessage[]) => {

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

}