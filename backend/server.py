from fastapi import FastAPI, APIRouter, Depends, HTTPException, UploadFile, File, Form, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import aiofiles
from enum import Enum
from io import BytesIO

# PDF Generation
from weasyprint import HTML
from jinja2 import Template

# Stripe Integration
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads" / "activities"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security setup
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Create the main app
app = FastAPI(title="Unplugged AI Academy")

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(ROOT_DIR / "uploads")), name="uploads")

# Create API router
api_router = APIRouter(prefix="/api")

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    PARENT = "parent"
    TEACHER = "teacher"
    ADMIN = "admin"

class AgeGroup(str, Enum):
    FOUNDATION = "5-8"  # Foundation Level
    DEVELOPMENT = "9-12"  # Development Level
    MASTERY = "13-16"  # Mastery Level

class ActivityType(str, Enum):
    PHYSICAL = "physical"  # Physical/offline activity
    DIGITAL = "digital"  # Digital interactive
    HYBRID = "hybrid"  # Both

class Topic(str, Enum):
    ALGORITHMS = "algorithms"
    AI_ML_CONCEPTS = "ai_ml_concepts"
    DATA_AND_LOGIC = "data_and_logic"

class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# Models
class UserBase(BaseModel):
    email: str
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str
    age_group: Optional[AgeGroup] = None  # For students
    language: str = "en"  # Default language

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    age_group: Optional[AgeGroup] = None
    language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    age_group: AgeGroup
    topic: Topic
    difficulty: Difficulty
    activity_type: ActivityType
    estimated_time: int  # in minutes
    is_premium: bool = False
    is_published: bool = True
    instructions: List[str]
    learning_objectives: List[str]
    image_url: Optional[str] = None
    created_by: Optional[str] = None  # teacher user id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ActivityCreate(BaseModel):
    title: str
    description: str
    age_group: AgeGroup
    topic: Topic
    difficulty: Difficulty
    activity_type: ActivityType
    estimated_time: int
    is_premium: bool = False
    instructions: List[str]
    learning_objectives: List[str]

class Completion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    activity_id: str
    activity_title: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    time_spent_minutes: int = 0

class Progress(BaseModel):
    student_id: str
    activities_completed: int = 0
    total_time_spent: int = 0  # in minutes
    streak_days: int = 0
    badges_earned: List[str] = []
    last_activity_date: Optional[datetime] = None
    points: int = 0

class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str  # emoji or icon name
    earned_at: datetime

class ParentChildLink(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    parent_id: str
    student_id: str
    student_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubscriptionPlan(BaseModel):
    id: str
    name: str
    age_group: AgeGroup
    price: float
    currency: str = "lkr"
    duration_days: int
    features: List[str]

# Pricing Plans
PRICING_PLANS = {
    "foundation_monthly": {
        "id": "foundation_monthly",
        "name": "Foundation Level - Monthly",
        "age_group": "5-8",
        "price": 1200.00,
        "currency": "lkr",
        "duration_days": 30,
        "features": ["AI Basics", "Simple Logic", "Creative Play", "Progress Tracking"]
    },
    "development_monthly": {
        "id": "development_monthly",
        "name": "Development Level - Monthly",
        "age_group": "9-12",
        "price": 1800.00,
        "currency": "lkr",
        "duration_days": 30,
        "features": ["Logical Reasoning", "AI Applications", "Design Thinking", "Complex Problems"]
    },
    "mastery_monthly": {
        "id": "mastery_monthly",
        "name": "Mastery Level - Monthly",
        "age_group": "13-16",
        "price": 2800.00,
        "currency": "lkr",
        "duration_days": 30,
        "features": ["Advanced AI", "Innovation Methods", "Leadership Skills", "Career Guidance"]
    }
}

# Certificate HTML Template
CERTIFICATE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4 landscape; margin: 0; }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 60px;
            background: linear-gradient(135deg, #157A8C 0%, #A8D5E2 100%);
            color: #333;
            height: 100vh;
            box-sizing: border-box;
        }
        .certificate {
            background: white;
            padding: 40px;
            border: 10px solid #157A8C;
            border-radius: 20px;
            text-align: center;
            height: 100%;
            box-sizing: border-box;
        }
        h1 {
            color: #157A8C;
            font-size: 48px;
            margin: 20px 0;
        }
        h2 {
            color: #0B1220;
            font-size: 32px;
            margin: 30px 0;
            text-decoration: underline;
        }
        .achievement {
            font-size: 24px;
            color: #555;
            margin: 20px 0;
        }
        .details {
            margin: 40px 0;
            font-size: 18px;
            color: #666;
        }
        .badge {
            font-size: 80px;
            margin: 20px 0;
        }
        .cert-id {
            font-size: 12px;
            color: #999;
            margin-top: 40px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <h1>🎓 Certificate of Achievement</h1>
        <div class="badge">🌟</div>
        <h2>{{ student_name }}</h2>
        <p class="achievement">Has successfully completed</p>
        <p class="achievement"><strong>{{ activities_completed }} Activities</strong></p>
        <p class="achievement">in AI & Computer Unplugged Learning</p>
        <div class="details">
            <p>Date: {{ completion_date }}</p>
            <p>Level: {{ level }}</p>
        </div>
        <p class="cert-id">Certificate ID: {{ certificate_id }}</p>
    </div>
</body>
</html>
"""

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**{k: v for k, v in user.items() if k != "hashed_password" and k != "_id"})

async def get_current_student(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Student access required")
    return current_user

async def get_current_parent(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.PARENT:
        raise HTTPException(status_code=403, detail="Parent access required")
    return current_user

async def get_current_teacher(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Teacher access required")
    return current_user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def check_subscription(user_id: str) -> bool:
    """Check if user has active subscription"""
    subscription = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
    if not subscription:
        return False
    
    # Check if expired
    expires_at = subscription.get("expires_at")
    if expires_at and expires_at < datetime.now(timezone.utc):
        await db.subscriptions.update_one(
            {"user_id": user_id},
            {"$set": {"status": "expired"}}
        )
        return False
    
    return True

async def award_badge(student_id: str, badge_name: str, badge_description: str, badge_icon: str):
    """Award a badge to a student"""
    badge = {
        "id": str(uuid.uuid4()),
        "name": badge_name,
        "description": badge_description,
        "icon": badge_icon,
        "earned_at": datetime.now(timezone.utc)
    }
    
    await db.progress.update_one(
        {"student_id": student_id},
        {"$push": {"badges_earned": badge}}
    )
    
    return badge

# Authentication Routes
@api_router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    del user_dict["password"]
    user_obj = User(**user_dict)
    
    user_data = user_obj.model_dump()
    user_data["hashed_password"] = hashed_password
    await db.users.insert_one(user_data)
    
    # Initialize progress for students
    if user_obj.role == UserRole.STUDENT:
        progress = Progress(student_id=user_obj.id)
        await db.progress.insert_one(progress.model_dump())
    
    return user_obj

@api_router.post("/login", response_model=Token)
async def login_user(login_data: UserLogin):
    user_data = await db.users.find_one({"email": login_data.email})
    if not user_data or not verify_password(login_data.password, user_data["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user_data["id"]})
    user = User(**{k: v for k, v in user_data.items() if k != "hashed_password" and k != "_id"})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.patch("/me/language")
async def update_user_language(
    language: str,
    current_user: User = Depends(get_current_user)
):
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"language": language}}
    )
    return {"message": "Language updated", "language": language}

# Leaderboard Routes
@api_router.get("/leaderboard")
async def get_leaderboard(period: str = "all"):
    """Get leaderboard - all time, weekly, or monthly"""
    # Get all student progress sorted by points
    leaderboard = await db.progress.find({}).sort("points", -1).limit(100).to_list(100)
    
    # Enrich with user data
    result = []
    for entry in leaderboard:
        user = await db.users.find_one({"id": entry["student_id"]}, {"_id": 0, "hashed_password": 0})
        if user:
            result.append({
                "rank": len(result) + 1,
                "student_name": user.get("full_name", "Anonymous"),
                "points": entry.get("points", 0),
                "activities_completed": entry.get("activities_completed", 0),
                "badges_count": len(entry.get("badges_earned", []))
            })
    
    return result

# Activities Routes
@api_router.get("/activities")
async def get_activities(
    age_group: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    is_premium: Optional[bool] = None
):
    query = {"is_published": True}
    
    if age_group:
        query["age_group"] = age_group
    if topic:
        query["topic"] = topic
    if difficulty:
        query["difficulty"] = difficulty
    if is_premium is not None:
        query["is_premium"] = is_premium
    
    activities = await db.activities.find(query, {"_id": 0}).to_list(1000)
    return activities

@api_router.get("/activities/{activity_id}")
async def get_activity(activity_id: str):
    activity = await db.activities.find_one({"id": activity_id}, {"_id": 0})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

@api_router.post("/activities", response_model=Activity)
async def create_activity(
    activity: ActivityCreate,
    current_user: User = Depends(get_current_teacher)
):
    activity_obj = Activity(**activity.model_dump(), created_by=current_user.id)
    await db.activities.insert_one(activity_obj.model_dump())
    return activity_obj

@api_router.post("/activities/{activity_id}/upload-image")
async def upload_activity_image(
    activity_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_teacher)
):
    # Check activity exists
    activity = await db.activities.find_one({"id": activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Save file
    file_ext = file.filename.split(".")[-1]
    file_name = f"{activity_id}_{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / file_name
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Update activity
    image_url = f"/uploads/activities/{file_name}"
    await db.activities.update_one(
        {"id": activity_id},
        {"$set": {"image_url": image_url}}
    )
    
    return {"image_url": image_url}

@api_router.post("/activities/{activity_id}/publish")
async def publish_activity(
    activity_id: str,
    current_user: User = Depends(get_current_admin)
):
    result = await db.activities.update_one(
        {"id": activity_id},
        {"$set": {"is_published": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"message": "Activity published"}

@api_router.post("/activities/{activity_id}/unpublish")
async def unpublish_activity(
    activity_id: str,
    current_user: User = Depends(get_current_admin)
):
    result = await db.activities.update_one(
        {"id": activity_id},
        {"$set": {"is_published": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"message": "Activity unpublished"}

# Completion Routes
@api_router.post("/completions")
async def mark_activity_complete(
    activity_id: str,
    time_spent_minutes: int = 0,
    current_user: User = Depends(get_current_student)
):
    # Check if activity is premium and user has subscription
    activity = await db.activities.find_one({"id": activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    if activity["is_premium"]:
        has_subscription = await check_subscription(current_user.id)
        if not has_subscription:
            raise HTTPException(status_code=403, detail="Premium subscription required")
    
    # Create completion
    completion = Completion(
        student_id=current_user.id,
        activity_id=activity_id,
        activity_title=activity["title"],
        time_spent_minutes=time_spent_minutes
    )
    await db.completions.insert_one(completion.model_dump())
    
    # Update progress
    progress = await db.progress.find_one({"student_id": current_user.id})
    if not progress:
        progress = Progress(student_id=current_user.id).model_dump()
    
    progress["activities_completed"] = progress.get("activities_completed", 0) + 1
    progress["total_time_spent"] = progress.get("total_time_spent", 0) + time_spent_minutes
    progress["last_activity_date"] = datetime.now(timezone.utc)
    progress["points"] = progress.get("points", 0) + 10  # Award 10 points per completion
    
    await db.progress.update_one(
        {"student_id": current_user.id},
        {"$set": progress},
        upsert=True
    )
    
    # Check for badge awards
    if progress["activities_completed"] == 1:
        await award_badge(current_user.id, "First Steps", "Completed your first activity!", "🎯")
    elif progress["activities_completed"] == 5:
        await award_badge(current_user.id, "Getting Started", "Completed 5 activities!", "🌟")
    elif progress["activities_completed"] == 10:
        await award_badge(current_user.id, "Rising Star", "Completed 10 activities!", "⭐")
    
    return {"message": "Activity completed", "points_earned": 10}

@api_router.get("/progress")
async def get_progress(current_user: User = Depends(get_current_student)):
    progress = await db.progress.find_one({"student_id": current_user.id}, {"_id": 0})
    if not progress:
        progress = Progress(student_id=current_user.id).model_dump()
    return progress

# Parent Routes
@api_router.post("/parent/link-child")
async def link_child(
    student_email: str,
    current_user: User = Depends(get_current_parent)
):
    student = await db.users.find_one({"email": student_email, "role": "student"})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if already linked
    existing = await db.parent_child_links.find_one({
        "parent_id": current_user.id,
        "student_id": student["id"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Child already linked")
    
    link = ParentChildLink(
        parent_id=current_user.id,
        student_id=student["id"],
        student_name=student["full_name"]
    )
    await db.parent_child_links.insert_one(link.model_dump())
    
    return {"message": "Child linked successfully"}

@api_router.get("/parent/children")
async def get_linked_children(current_user: User = Depends(get_current_parent)):
    links = await db.parent_child_links.find({"parent_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    children_data = []
    for link in links:
        student = await db.users.find_one({"id": link["student_id"]}, {"_id": 0, "hashed_password": 0})
        progress = await db.progress.find_one({"student_id": link["student_id"]}, {"_id": 0})
        
        if student:
            children_data.append({
                "student": student,
                "progress": progress or Progress(student_id=link["student_id"]).model_dump()
            })
    
    return children_data

# Subscription Routes
@api_router.get("/subscriptions/plans")
async def get_subscription_plans():
    return list(PRICING_PLANS.values())

@api_router.post("/subscriptions/checkout")
async def create_subscription_checkout(
    plan_id: str,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    if plan_id not in PRICING_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = PRICING_PLANS[plan_id]
    
    # Get host URL from request
    host_url = str(request.base_url).rstrip("/")
    
    # Initialize Stripe
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=plan["price"],
        currency=plan["currency"],
        success_url=f"{host_url}/subscription-success?session_id={{{{CHECKOUT_SESSION_ID}}}}",
        cancel_url=f"{host_url}/pricing",
        metadata={
            "user_id": current_user.id,
            "plan_id": plan_id,
            "user_email": current_user.email
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Store transaction
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "amount": plan["price"],
        "currency": plan["currency"],
        "status": "initiated",
        "payment_status": "pending",
        "metadata": checkout_request.metadata,
        "created_at": datetime.now(timezone.utc)
    }
    await db.payment_transactions.insert_one(transaction)
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": webhook_response.session_id},
            {"$set": {
                "status": "completed" if webhook_response.payment_status == "paid" else "failed",
                "payment_status": webhook_response.payment_status,
                "completed_at": datetime.now(timezone.utc)
            }}
        )
        
        # Activate subscription if paid
        if webhook_response.payment_status == "paid":
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if transaction:
                user_id = transaction["metadata"]["user_id"]
                plan_id = transaction["metadata"]["plan_id"]
                plan = PRICING_PLANS[plan_id]
                
                expires_at = datetime.now(timezone.utc) + timedelta(days=plan["duration_days"])
                
                await db.subscriptions.update_one(
                    {"user_id": user_id},
                    {"$set": {
                        "user_id": user_id,
                        "plan_id": plan_id,
                        "status": "active",
                        "started_at": datetime.now(timezone.utc),
                        "expires_at": expires_at
                    }},
                    upsert=True
                )
        
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/subscriptions/status/{session_id}")
async def get_checkout_status(session_id: str):
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status = await stripe_checkout.get_checkout_status(session_id)
    return status

# Certificate Routes
@api_router.post("/certificates/generate")
async def generate_certificate(current_user: User = Depends(get_current_student)):
    # Get progress
    progress = await db.progress.find_one({"student_id": current_user.id})
    if not progress or progress.get("activities_completed", 0) < 5:
        raise HTTPException(status_code=400, detail="Complete at least 5 activities to earn a certificate")
    
    # Generate certificate
    template = Template(CERTIFICATE_TEMPLATE)
    html_content = template.render(
        student_name=current_user.full_name,
        activities_completed=progress.get("activities_completed", 0),
        completion_date=datetime.now().strftime("%B %d, %Y"),
        level=f"{current_user.age_group} years" if current_user.age_group else "All Levels",
        certificate_id=f"CERT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    )
    
    # Convert to PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    # Return as download
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=certificate_{current_user.full_name.replace(' ', '_')}.pdf"}
    )

# Admin Routes
@api_router.get("/admin/users")
async def get_all_users(current_user: User = Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    return users

@api_router.get("/admin/analytics")
async def get_admin_analytics(current_user: User = Depends(get_current_admin)):
    total_users = await db.users.count_documents({})
    total_students = await db.users.count_documents({"role": "student"})
    total_activities = await db.activities.count_documents({"is_published": True})
    total_completions = await db.completions.count_documents({})
    
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_activities": total_activities,
        "total_completions": total_completions
    }

# Health check
@api_router.get("/")
async def root():
    return {
        "message": "Unplugged AI Academy API",
        "version": "1.0.0"
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
