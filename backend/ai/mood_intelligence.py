from ai.groq_client import groq_client

def generate_mood_insight(stats: dict) -> str:
    """Generate a personalized wellness insight based on recent mood statistics using Groq LLaMA 3."""
    
    if not stats or stats.get('total_entries', 0) == 0:
        return "Not enough data yet. Log your mood for a few days so I can analyze your trends!"
        
    avg_energy = stats.get('average_energy', 0)
    avg_stress = stats.get('average_stress', 0)
    most_common = stats.get('most_common_mood', 'Unknown')
    total = stats.get('total_entries', 0)

    system_prompt = """
    You are an empathetic, highly intelligent AI wellness coach.
    Analyze the user's recent mood data and provide a short, actionable, and encouraging insight (max 3 sentences).
    Do NOT use markdown. Do NOT use emojis. Just plain text.
    """
    
    user_prompt = f"""
    Over the last {total} logs:
    - Average Energy (1-10): {avg_energy}
    - Average Stress (1-10): {avg_stress}
    - Most Common Mood: {most_common}
    
    Give me an insight on my wellness and one piece of actionable advice.
    """
    
    response_text = groq_client.generate_completion(prompt=user_prompt, system_prompt=system_prompt)
    
    return response_text.strip()
