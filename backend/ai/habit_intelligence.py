from ai.groq_client import groq_client
import json

def generate_habit_recommendations(active_habits: list) -> list:
    """Generate smart habit recommendations based on current habits using Groq LLaMA 3."""
    
    habit_names = [h.name for h in active_habits]
    
    system_prompt = """
    You are an elite productivity and wellness AI coach.
    Based on the user's current habits, suggest 3 NEW complimentary habits that would optimize their life.
    Return ONLY a raw JSON array of objects. Do not include markdown formatting or extra text.
    Format: [{"title": "Habit Name", "description": "Why they should do it", "frequency": "daily"}]
    """
    
    user_prompt = f"My current habits are: {', '.join(habit_names) if habit_names else 'None'}. Recommend 3 new synergistic habits."
    
    response_text = groq_client.generate_completion(prompt=user_prompt, system_prompt=system_prompt)
    
    # Safely parse the JSON response
    try:
        # Strip markdown if the LLM accidentally added it
        clean_json = response_text.strip().replace('```json', '').replace('```', '')
        recommendations = json.loads(clean_json)
        return recommendations
    except Exception as e:
        print(f"Failed to parse Groq response: {e}")
        # Fallback recommendations if parsing fails
        return [
            {"title": "Morning Hydration", "description": "Drink 16oz of water upon waking up.", "frequency": "daily"},
            {"title": "Digital Sunset", "description": "No screens 1 hour before bed.", "frequency": "daily"},
            {"title": "Weekly Review", "description": "Plan your upcoming week every Sunday.", "frequency": "weekly"}
        ]
