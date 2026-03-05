"""
Add educational explanations to all 38 activities
"""

import asyncio
import sys
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ.get('DB_NAME', 'ai_unplugged_db')

# Educational explanations by topic
TOPIC_EXPLANATIONS = {
    "algorithms": {
        "title": "What is an Algorithm?",
        "explanation": """An algorithm is like a recipe or a set of step-by-step instructions to solve a problem or complete a task. Just like following a recipe to bake a cake, computers follow algorithms to solve problems!

Think about how you get ready for school:
1. Wake up
2. Brush your teeth
3. Get dressed
4. Eat breakfast
5. Pack your bag
6. Go to school

This is an algorithm! Each step must be done in order, and you can't skip any steps. Algorithms are everywhere - in games, apps, GPS navigation, and even in how search engines find information for you.

Why are algorithms important?
• They help us solve problems efficiently
• They break big problems into small, manageable steps
• They can be reused for similar problems
• They form the foundation of all computer programs"""
    },
    
    "ai_ml_concepts": {
        "title": "What is Artificial Intelligence (AI)?",
        "explanation": """Artificial Intelligence (AI) is when computers and machines learn to think and make decisions like humans do! It's like teaching a computer to be smart.

Imagine teaching a baby to recognize a cat:
• You show them pictures of cats
• They learn what cats look like
• Soon they can spot cats on their own

That's exactly how AI works! We show computers lots of examples, and they learn patterns.

Machine Learning (ML) is a type of AI where computers learn from data without being explicitly programmed for every situation.

Examples of AI you use every day:
• Voice assistants (Siri, Alexa) - understand your speech
• YouTube recommendations - suggest videos you might like
• Face unlock on phones - recognizes your face
• Auto-correct - predicts what you want to type
• Games - computer opponents that get smarter

AI is helping doctors find diseases, scientists discover new medicines, and artists create amazing art. The future of AI is exciting!"""
    },
    
    "data_and_logic": {
        "title": "What is Data and How Computers Think?",
        "explanation": """Data is information stored in a way that computers can understand. Everything you see on a computer - pictures, videos, music, games - is all made of data!

Computers think in Binary - just 0s and 1s!
• 0 means OFF (like a light switch)
• 1 means ON
• By combining millions of 0s and 1s, computers can store anything!

Think of it like Morse code with dots and dashes, but computers use 0s and 1s instead.

Logic is how computers make decisions:
• IF it's raining THEN take an umbrella
• IF you're hungry THEN eat food
• IF button is pressed THEN open app

This is called "Boolean Logic" - decisions that are either TRUE or FALSE, YES or NO, ON or OFF.

Examples of Data & Logic in action:
• Photos are millions of tiny colored dots (pixels)
• Music is stored as numbers representing sound waves
• Your passwords are scrambled (encrypted) for security
• Games use logic to check if you won or lost
• Websites store your preferences as data

Understanding data and logic helps you understand how the digital world works!"""
    }
}

async def add_explanations():
    """Add educational explanations to all activities"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        activities = await db.activities.find({}).to_list(1000)
        
        updated = 0
        for activity in activities:
            topic = activity.get('topic')
            if topic and topic in TOPIC_EXPLANATIONS:
                explanation = TOPIC_EXPLANATIONS[topic]
                
                # Add explanation to activity
                await db.activities.update_one(
                    {"id": activity["id"]},
                    {"$set": {
                        "topic_explanation_title": explanation["title"],
                        "topic_explanation": explanation["explanation"]
                    }}
                )
                updated += 1
        
        print(f"✅ Added educational explanations to {updated} activities!")
        print("\n📚 Explanations Added:")
        print(f"   • Algorithms: {TOPIC_EXPLANATIONS['algorithms']['title']}")
        print(f"   • AI/ML: {TOPIC_EXPLANATIONS['ai_ml_concepts']['title']}")
        print(f"   • Data & Logic: {TOPIC_EXPLANATIONS['data_and_logic']['title']}")
        
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_explanations())
