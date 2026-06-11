import os
from groq import Groq
from config import GROQ_API_KEY

class GroqClient:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        if not self.api_key:
            print("WARNING: GROQ_API_KEY is not set.")
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile" # Premium Llama 3.3 70B model

    def generate_completion(self, prompt: str, system_prompt: str = "You are a helpful AI.") -> str:
        """Generate a response using Groq."""
        if not self.api_key:
            return "AI services are currently unavailable."
            
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1024,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return "Failed to generate AI response."

# Singleton instance
groq_client = GroqClient()
