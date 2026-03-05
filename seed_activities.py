"""
Seed 15-20 curated unplugged activities for AI + Computer Science learning
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

# 18 Curated Unplugged Activities
ACTIVITIES = [
    # ALGORITHMS - Foundation (5-8)
    {
        "id": str(uuid.uuid4()),
        "title": "Human Sorting Algorithm",
        "description": "Learn bubble sort by physically sorting students by height or birthday!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Have 5-10 students line up randomly",
            "Compare two adjacent students at a time (by height/birthday)",
            "Swap positions if they're out of order",
            "Repeat until everyone is sorted",
            "Discuss the pattern - this is bubble sort!"
        ],
        "learning_objectives": [
            "Understanding step-by-step algorithms",
            "Comparison operations",
            "Pattern recognition",
            "Collaborative problem solving"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Treasure Hunt Algorithm",
        "description": "Follow step-by-step instructions to find hidden treasures and learn sequencing!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Create a simple treasure map with numbered steps",
            "Write clear instructions: 'Walk 5 steps forward', 'Turn right', etc.",
            "Kids follow the algorithm (instructions) exactly",
            "Discuss what happens if you skip a step or do them out of order",
            "Let kids create their own treasure hunt algorithms"
        ],
        "learning_objectives": [
            "Sequential thinking",
            "Following precise instructions",
            "Understanding order matters in algorithms"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # ALGORITHMS - Development (9-12)
    {
        "id": str(uuid.uuid4()),
        "title": "Card Sorting Showdown",
        "description": "Race to sort playing cards using different sorting algorithms!",
        "age_group": "9-12",
        "topic": "algorithms",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Give each student a shuffled deck of 10 cards",
            "Group 1: Use Bubble Sort (compare adjacent, swap if needed)",
            "Group 2: Use Selection Sort (find smallest, move to front)",
            "Group 3: Use Insertion Sort (build sorted pile one by one)",
            "Time each method and compare results",
            "Discuss which is faster and why"
        ],
        "learning_objectives": [
            "Different sorting algorithms",
            "Algorithm efficiency",
            "Time complexity basics"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Binary Search Guessing Game",
        "description": "Guess a number between 1-100 using the binary search strategy!",
        "age_group": "9-12",
        "topic": "algorithms",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "One person thinks of a number between 1-100",
            "Guesser must use binary search: always guess the middle number",
            "After each guess, get 'higher' or 'lower' hint",
            "Count how many guesses it takes",
            "Compare to random guessing - binary search is much faster!",
            "Discuss: Why does this work? (Eliminating half each time)"
        ],
        "learning_objectives": [
            "Binary search algorithm",
            "Divide and conquer strategy",
            "Logarithmic growth"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # ALGORITHMS - Mastery (13-16)
    {
        "id": str(uuid.uuid4()),
        "title": "Shortest Path Challenge",
        "description": "Find the shortest route through a maze using graph algorithms!",
        "age_group": "13-16",
        "topic": "algorithms",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Create a grid maze using tape or chalk on the floor",
            "Mark start and end points",
            "Team 1: Use depth-first search (explore one path fully)",
            "Team 2: Use breadth-first search (explore all neighbors first)",
            "Map out the paths taken by each team",
            "Compare efficiency and discuss real-world applications (GPS, networks)"
        ],
        "learning_objectives": [
            "Graph traversal algorithms",
            "DFS vs BFS",
            "Pathfinding applications"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # DATA & LOGIC - Foundation (5-8)
    {
        "id": str(uuid.uuid4()),
        "title": "Binary Numbers with Cards",
        "description": "Learn binary counting using playing cards or paper cards marked 1, 2, 4, 8, 16",
        "age_group": "5-8",
        "topic": "data_and_logic",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Create cards with powers of 2: 1, 2, 4, 8, 16",
            "Flip cards face-up (1) or face-down (0)",
            "Add up face-up cards to get decimal number",
            "Practice counting from 0-31 in binary",
            "Try representing your age in binary!",
            "Discuss: This is how computers count!"
        ],
        "learning_objectives": [
            "Binary number system",
            "Powers of 2",
            "Digital data representation",
            "Base conversion"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Pixel Art Image Processing",
        "description": "Create pixel art to understand how computers store and display images",
        "age_group": "5-8",
        "topic": "data_and_logic",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Give students grid paper (8x8 or larger)",
            "Assign colors to numbers (1=red, 2=blue, 3=yellow, etc.)",
            "Call out number sequences: '1,1,2,2,1,1,2,2...'",
            "Students color squares to create a pattern",
            "Reveal the final image - it's pixel art!",
            "Discuss how computers store images as numbers"
        ],
        "learning_objectives": [
            "Image representation",
            "Grids and coordinates",
            "Data encoding",
            "Pixels and resolution"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # DATA & LOGIC - Development (9-12)
    {
        "id": str(uuid.uuid4()),
        "title": "Logic Gates with Hand Signals",
        "description": "Learn AND, OR, NOT gates using hand gestures and team signals!",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Hands up = TRUE (1), Hands down = FALSE (0)",
            "AND Gate: Both hands up = output hands up",
            "OR Gate: At least one hand up = output hands up",
            "NOT Gate: Input hands up = output hands down (opposite)",
            "Create chains: Person A → AND gate → Person B → OR gate → Result",
            "Practice complex logic circuits with the whole class"
        ],
        "learning_objectives": [
            "Boolean logic",
            "Logic gates (AND, OR, NOT)",
            "Digital circuits basics",
            "Truth tables"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Data Compression Game",
        "description": "Send messages using fewer words - learn data compression!",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Write a simple message on the board",
            "Challenge: Send the same message using fewer characters",
            "Examples: 'see you tomorrow' → 'c u 2moro', 'AAA' → '3A'",
            "Each team compresses a message",
            "Other teams must decompress it back to original",
            "Discuss: This is how ZIP files work!"
        ],
        "learning_objectives": [
            "Data compression concepts",
            "Information encoding",
            "Lossless vs lossy compression"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # DATA & LOGIC - Mastery (13-16)
    {
        "id": str(uuid.uuid4()),
        "title": "Encryption Code Breakers",
        "description": "Learn Caesar cipher and basic encryption by encoding secret messages!",
        "age_group": "13-16",
        "topic": "data_and_logic",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Learn Caesar cipher: shift each letter by N positions",
            "Example with shift 3: A→D, B→E, HELLO→KHOOR",
            "Teams create encrypted messages",
            "Exchange messages and try to decrypt them",
            "Discuss frequency analysis to crack codes",
            "Explore modern encryption: why simple ciphers aren't secure"
        ],
        "learning_objectives": [
            "Basic encryption",
            "Cybersecurity concepts",
            "Patterns in data",
            "Cryptography foundations"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # AI/ML CONCEPTS - Foundation (5-8)
    {
        "id": str(uuid.uuid4()),
        "title": "Pattern Recognition Detective",
        "description": "Find patterns in shapes, colors, and sounds - the foundation of AI!",
        "age_group": "5-8",
        "topic": "ai_ml_concepts",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Show sequences: Red, Blue, Red, Blue, ?",
            "Students identify the pattern and predict next item",
            "Try with shapes: Circle, Square, Circle, Square, ?",
            "Make it harder: Red Square, Blue Circle, Red Square, Blue ?, ?",
            "Discuss: AI learns by finding patterns just like this!"
        ],
        "learning_objectives": [
            "Pattern recognition",
            "Prediction",
            "Observation skills",
            "AI basics"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Sorting Objects - Machine Learning",
        "description": "Sort objects by their features to understand how AI classifies things!",
        "age_group": "5-8",
        "topic": "ai_ml_concepts",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Gather mixed objects: toys, fruits, school supplies",
            "Sort them by one feature: color, size, shape",
            "Try sorting by multiple features: big AND red",
            "Discuss: What rules did you use to sort?",
            "Explain: AI learns these rules to classify pictures, words, etc."
        ],
        "learning_objectives": [
            "Classification",
            "Features and attributes",
            "Decision rules",
            "Supervised learning basics"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # AI/ML CONCEPTS - Development (9-12)
    {
        "id": str(uuid.uuid4()),
        "title": "Decision Tree Builder",
        "description": "Create a decision tree to classify animals - learn how AI makes decisions!",
        "age_group": "9-12",
        "topic": "ai_ml_concepts",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Pick 6 animals: dog, fish, bird, snake, frog, butterfly",
            "Create decision tree: Does it fly? Yes→Bird/Butterfly, No→...",
            "Next question: Does it live in water? etc.",
            "Draw the complete tree on board",
            "Test with new animals",
            "Discuss: This is how AI decision trees work!"
        ],
        "learning_objectives": [
            "Decision trees",
            "Classification algorithms",
            "Binary decisions",
            "Feature selection"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Training a Human Robot",
        "description": "One person is a 'robot' learning to sort - others 'train' them with examples!",
        "age_group": "9-12",
        "topic": "ai_ml_concepts",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "One student is the 'robot' (closes eyes or wears blindfold)",
            "Others place objects and say 'fruit' or 'not fruit'",
            "Robot learns to recognize fruits by touch/smell",
            "After 10 examples, test the robot with new objects",
            "Discuss: AI learns from training data the same way!",
            "What if training data was wrong? (Biased AI)"
        ],
        "learning_objectives": [
            "Machine learning process",
            "Training data concept",
            "Feedback and learning",
            "AI bias awareness"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # AI/ML CONCEPTS - Mastery (13-16)
    {
        "id": str(uuid.uuid4()),
        "title": "Neural Network Simulation",
        "description": "Simulate a simple neural network with students as neurons!",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 35,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Arrange students in layers: Input (3), Hidden (4), Output (2)",
            "Each connection has a 'weight' (strength): strong, medium, weak",
            "Input students hold up fingers (signal strength 0-5)",
            "Hidden layer students add weighted signals and pass forward",
            "Output layer determines result: Cat or Dog",
            "Train the network by adjusting weights when wrong",
            "Discuss: Real neural networks have millions of 'neurons'!"
        ],
        "learning_objectives": [
            "Neural network structure",
            "Weights and activation",
            "Deep learning basics",
            "Backpropagation concept"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "AI Ethics Debate",
        "description": "Discuss real AI ethics scenarios - bias, privacy, and fairness",
        "age_group": "13-16",
        "topic": "ai_ml_concepts",
        "difficulty": "advanced",
        "activity_type": "physical",
        "estimated_time": 30,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Present scenarios: AI hiring tool rejects women, AI medical diagnosis, self-driving car moral dilemmas",
            "Divide class into teams with different perspectives",
            "Teams debate: What's the right thing to do?",
            "Discuss: Who's responsible when AI makes mistakes?",
            "Explore: How can we make AI fair and ethical?"
        ],
        "learning_objectives": [
            "AI ethics",
            "Algorithmic bias",
            "Privacy and security",
            "Responsible AI development"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    # BONUS ACTIVITIES
    {
        "id": str(uuid.uuid4()),
        "title": "Network Routing with String",
        "description": "Learn how internet routing works using students and string!",
        "age_group": "9-12",
        "topic": "algorithms",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": True,
        "is_published": True,
        "instructions": [
            "Students stand in a network pattern (like cities)",
            "Use string to show connections between nodes",
            "Send a 'message' (ball) from point A to point B",
            "Find the shortest path",
            "Cut a string connection - find alternate route",
            "Discuss: This is how internet packets travel!"
        ],
        "learning_objectives": [
            "Network topology",
            "Routing algorithms",
            "Redundancy and reliability",
            "Internet basics"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    },
    
    {
        "id": str(uuid.uuid4()),
        "title": "Debugging Charades",
        "description": "Act out common computer bugs - learn debugging skills!",
        "age_group": "5-8",
        "topic": "algorithms",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 15,
        "is_premium": False,
        "is_published": True,
        "instructions": [
            "Create simple algorithms for actions: Make sandwich, Brush teeth",
            "Introduce 'bugs': Missing step, wrong order, infinite loop",
            "Students act out the buggy algorithm",
            "Class identifies the bug",
            "Fix it and try again",
            "Celebrate successful debugging!"
        ],
        "learning_objectives": [
            "Debugging concept",
            "Testing and fixing",
            "Error detection",
            "Problem-solving"
        ],
        "created_by": None,
        "created_at": datetime.now(timezone.utc)
    }
]

async def seed_activities():
    """Seed activities into database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Clear existing activities (optional - comment out in production)
        # await db.activities.delete_many({})
        
        # Check which activities already exist
        existing_titles = set()
        existing_activities = await db.activities.find({}, {"title": 1}).to_list(1000)
        for activity in existing_activities:
            existing_titles.add(activity["title"])
        
        # Insert new activities
        new_activities = [a for a in ACTIVITIES if a["title"] not in existing_titles]
        
        if new_activities:
            result = await db.activities.insert_many(new_activities)
            print(f"✅ Successfully seeded {len(result.inserted_ids)} new activities!")
            print(f"   Total activities in database: {len(existing_titles) + len(new_activities)}")
        else:
            print("✅ All activities already exist in database!")
            print(f"   Total activities: {len(existing_titles)}")
        
        # Print summary by category
        all_activities = await db.activities.find({}).to_list(1000)
        by_age = {}
        by_topic = {}
        free_count = 0
        premium_count = 0
        
        for activity in all_activities:
            age = activity["age_group"]
            topic = activity["topic"]
            
            by_age[age] = by_age.get(age, 0) + 1
            by_topic[topic] = by_topic.get(topic, 0) + 1
            
            if activity["is_premium"]:
                premium_count += 1
            else:
                free_count += 1
        
        print("\n📊 Activity Summary:")
        print(f"   Free: {free_count} | Premium: {premium_count}")
        print("\n   By Age Group:")
        for age, count in sorted(by_age.items()):
            print(f"     {age}: {count} activities")
        print("\n   By Topic:")
        for topic, count in sorted(by_topic.items()):
            print(f"     {topic.replace('_', ' ').title()}: {count} activities")
        
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_activities())
