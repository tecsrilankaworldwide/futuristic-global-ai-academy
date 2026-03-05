"""
Add 20 more curated unplugged activities
Total will be 38 activities after this seed
"""

import asyncio
import sys
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ.get('DB_NAME', 'ai_unplugged_db')

NEW_ACTIVITIES = [
    # ALGORITHMS
    {
        "id": str(uuid.uuid4()),
        "title": "Recipe Algorithm Challenge",
        "description": "Follow cooking recipes as algorithms and discover why precision matters!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Choose a simple recipe (sandwich, fruit salad)",
            "Write each step as an algorithm instruction",
            "Have students follow the 'algorithm' exactly",
            "Try skipping a step - what happens?",
            "Discuss: Why must algorithms be precise and complete?"
        ],
        "learning_objectives": ["Sequential instructions", "Completeness in algorithms", "Following procedures"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Quicksort Human Partition",
        "description": "Learn quicksort by having students partition themselves around a pivot!",
        "age_group": "13-16",
        "topic": "algorithms",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Choose one student as the 'pivot' (e.g., by height)",
            "All shorter students move to the left, taller to the right",
            "Repeat the process for each group recursively",
            "Continue until everyone is sorted",
            "Discuss: This is quicksort! Why is it fast?"
        ],
        "learning_objectives": ["Quicksort algorithm", "Divide and conquer", "Recursion concept"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # DATA & LOGIC
    {
        "id": str(uuid.uuid4()),
        "title": "ASCII Art Encoding",
        "description": "Create pictures using characters to understand text encoding!",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Give students grid paper",
            "Create simple pictures using only these characters: @ # * . -",
            "@ = very dark, # = dark, * = medium, . = light, - = very light",
            "Draw a smiley face or simple object",
            "Share your ASCII art with the class",
            "Discuss: Computers store text as numbers (ASCII codes)"
        ],
        "learning_objectives": ["Character encoding", "ASCII concept", "Data representation"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Error Detection Parity Bit",
        "description": "Learn error detection by adding parity bits to messages!",
        "age_group": "13-16",
        "topic": "data_and_logic",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Write a message in binary (simple 4-bit numbers)",
            "Count the 1s in each number",
            "Add a 'parity bit': 1 if odd number of 1s, 0 if even",
            "Pass the message to another team",
            "They flip one bit randomly (introduce error)",
            "Use parity to detect which number has an error",
            "Discuss: This is how computers detect transmission errors"
        ],
        "learning_objectives": ["Error detection", "Parity checking", "Data integrity"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Huffman Coding Tree",
        "description": "Build a Huffman tree to compress messages efficiently!",
        "age_group": "13-16",
        "topic": "data_and_logic",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 35,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Count letter frequency in a message",
            "Draw tree with most frequent letters nearest root",
            "Assign 0/1 codes based on tree path",
            "Encode message using new codes",
            "Compare length to original - it's shorter!",
            "Discuss: This is how ZIP compression works"
        ],
        "learning_objectives": ["Compression algorithms", "Tree structures", "Huffman coding"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # AI/ML CONCEPTS
    {
        "id": str(uuid.uuid4()),
        "title": "Image Recognition Game",
        "description": "Play 20 questions to understand how AI recognizes images!",
        "age_group": "5-8",
        "topic": "ai_ml_concepts",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Show students pictures of animals",
            "Ask yes/no questions: Does it have fur? Four legs? Long tail?",
            "Students guess the animal",
            "Discuss: AI asks similar questions to identify images",
            "Try with everyday objects"
        ],
        "learning_objectives": ["Feature detection", "Classification", "Pattern recognition"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Recommendation System",
        "description": "Build a simple recommendation system like Netflix or YouTube!",
        "age_group": "9-12",
        "topic": "ai_ml_concepts",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Each student rates 5 movies: ⭐⭐⭐⭐⭐ to ⭐",
            "Find students with similar ratings (similar taste)",
            "Recommend movies they liked but you haven't seen",
            "Discuss: Netflix uses this collaborative filtering",
            "Why do recommendations sometimes feel creepy?"
        ],
        "learning_objectives": ["Recommendation algorithms", "Collaborative filtering", "Similarity measures"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Reinforcement Learning Maze",
        "description": "Teach a 'robot' to navigate a maze through rewards!",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Create a maze with tape on the floor",
            "Blindfold one student (the AI agent)",
            "Guide them with rewards: clap for good moves, silence for bad",
            "Let them try multiple times - they'll improve!",
            "Remove blindfold and discuss learning process",
            "This is reinforcement learning - how robots learn"
        ],
        "learning_objectives": ["Reinforcement learning", "Reward signals", "Trial and error learning"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Sentiment Analysis",
        "description": "Analyze movie reviews to determine positive or negative sentiment!",
        "age_group": "9-12",
        "topic": "ai_ml_concepts",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Collect 10 simple movie reviews",
            "Count positive words (great, amazing, love) vs negative (bad, boring, hate)",
            "If more positive words → positive review",
            "Test your rule on new reviews",
            "Discuss: AI analyzes millions of reviews this way"
        ],
        "learning_objectives": ["Sentiment analysis", "Text processing", "Natural language processing"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Overfitting Demo",
        "description": "Understand overfitting by memorizing vs understanding patterns!",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Show 5 math problems with answers (e.g., 2+3=5)",
            "Student A memorizes the exact problems",
            "Student B learns the pattern (addition)",
            "Test with new problems: Who does better?",
            "Discuss: Memorizing = overfitting, Understanding = good AI"
        ],
        "learning_objectives": ["Overfitting concept", "Generalization", "Training vs testing"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # MIXED TOPICS
    {
        "id": str(uuid.uuid4()),
        "title": "Robot Commands Game",
        "description": "Program a human robot with simple commands - learn coding basics!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "One student is the 'robot'",
            "Others give commands: FORWARD, TURN LEFT, TURN RIGHT, STOP",
            "Robot follows commands exactly (no thinking!)",
            "Try to navigate robot across the room",
            "Discuss: This is how we program computers"
        ],
        "learning_objectives": ["Programming basics", "Commands and instructions", "Literal interpretation"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Conditionals with Traffic Lights",
        "description": "Learn IF-THEN logic using traffic light scenarios!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Create traffic light cards: Red, Yellow, Green",
            "Teach rules: IF Red THEN Stop, IF Green THEN Go",
            "Hold up different colors, students follow rules",
            "Add more rules: IF Yellow THEN Slow Down",
            "Discuss: These are conditionals in programming"
        ],
        "learning_objectives": ["Conditional logic", "IF-THEN statements", "Rule-based behavior"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Loop-the-Loop Dance",
        "description": "Learn loops by repeating dance moves!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Create a simple dance: clap, jump, spin",
            "Do it once",
            "Now REPEAT 5 times - that's a loop!",
            "Try different numbers of repeats",
            "Discuss: Loops save time in programming"
        ],
        "learning_objectives": ["Loops concept", "Repetition", "FOR loops"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Variables with Boxes",
        "description": "Understand variables by storing values in labeled boxes!",
        "age_group": "9-12",
        "topic": "algorithms",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Get 3 boxes, label them: AGE, NAME, SCORE",
            "Put values in boxes: AGE=10, NAME=Alex, SCORE=100",
            "Read values from boxes",
            "Change values: SCORE=SCORE+10",
            "Discuss: Variables store data in programming"
        ],
        "learning_objectives": ["Variables", "Data storage", "Value assignment"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Hash Function Magic",
        "description": "Learn hash functions by creating unique fingerprints for words!",
        "age_group": "13-16",
        "topic": "data_and_logic",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Create a simple hash: add letter positions (A=1, B=2, ...)",
            "Hash CAT: C(3)+A(1)+T(20)=24",
            "Try many words, find hash collisions (different words, same hash)",
            "Discuss: Passwords are stored as hashes",
            "Why can't we reverse a hash?"
        ],
        "learning_objectives": ["Hash functions", "One-way functions", "Password security"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Stack and Queue Cafeteria",
        "description": "Learn data structures using cafeteria line and dish stack!",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Stack: Pile books - last in, first out (LIFO)",
            "Queue: Line up students - first in, first out (FIFO)",
            "Try both with objects",
            "When do we use stacks? (browser back button)",
            "When do we use queues? (printer jobs)"
        ],
        "learning_objectives": ["Data structures", "Stack vs Queue", "LIFO and FIFO"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Cloud Storage Relay",
        "description": "Understand cloud storage by passing files between locations!",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "One desk = 'your computer', another = 'the cloud'",
            "Upload: move a paper file to cloud desk",
            "Download: bring it back",
            "Sync: multiple people access same file",
            "Discuss: Google Drive, Dropbox work this way"
        ],
        "learning_objectives": ["Cloud computing", "File synchronization", "Remote storage"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Face Recognition Privacy",
        "description": "Discuss ethical issues with facial recognition AI!",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Scenario: School wants facial recognition for attendance",
            "Pros: No forgetting student ID, automatic attendance",
            "Cons: Privacy concerns, data breaches, surveillance",
            "Debate in groups: Should schools use it?",
            "Discuss: Balance between convenience and privacy"
        ],
        "learning_objectives": ["AI ethics", "Privacy", "Technology trade-offs"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Bias in AI Training",
        "description": "Discover how biased training data creates biased AI!",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Train a student to classify 'scientists' using only male examples",
            "Test with photos - they'll likely say women aren't scientists",
            "Discuss: AI learns bias from training data",
            "Real examples: Amazon's hiring AI, photo recognition fails",
            "How can we fix biased AI?"
        ],
        "learning_objectives": ["AI bias", "Training data importance", "Fairness in ML"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Abstraction Layers",
        "description": "Learn abstraction by hiding complexity at each level!",
        "age_group": "13-16",
        "topic": "algorithms",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Task: Make a sandwich",
            "Level 1: 'Make sandwich' (abstract)",
            "Level 2: 'Get bread, add filling, close'",
            "Level 3: 'Walk to kitchen, open cabinet, take bread...'",
            "Discuss: Each level hides details",
            "This is how software works - layers of abstraction"
        ],
        "learning_objectives": ["Abstraction", "Modularity", "Layered systems"],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    }
]

async def seed_more_activities():
    """Add 20 more activities"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        existing_titles = set()
        existing = await db.activities.find({}, {"title": 1}).to_list(1000)
        for a in existing:
            existing_titles.add(a["title"])
        
        new_ones = [a for a in NEW_ACTIVITIES if a["title"] not in existing_titles]
        
        if new_ones:
            result = await db.activities.insert_many(new_ones)
            print(f"✅ Added {len(result.inserted_ids)} new activities!")
        else:
            print("✅ All 20 activities already exist!")
        
        total = await db.activities.count_documents({})
        print(f"📊 Total activities in database: {total}")
        
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_more_activities())
