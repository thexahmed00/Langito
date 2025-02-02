import axios from "axios"

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const fetchOpenAIResponse = async (prompt:ChatMessage[]) => {
  try {
    const result = await axios.post(
      'https://my-first-worker.mussahmed081.workers.dev',
      {
        messages: prompt,
        max_tokens: 150,
        temperature: 0.6,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      }
    );

    if (!result.data.choices || !result.data.choices[0]) {
      throw new Error('Invalid response from API');
    }

    return result.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    throw error;
  }
}