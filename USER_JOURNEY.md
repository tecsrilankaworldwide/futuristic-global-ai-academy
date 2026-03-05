# 🎯 Complete User Journey - Registration to Payment

## 📋 Full User Flow

### **STEP 1: Landing Page**
**URL:** https://algorithm-learn.preview.emergentagent.com

**What User Sees:**
- 🎓 Hero section with platform intro
- 🌍 Language selector (top-right)
- 📚 3 topic cards (Algorithms, AI/ML, Data & Logic)
- 💰 Pricing section (scroll down)
- 🔵 "Start Learning Free" button
- 🔵 "Login" button

**Actions:**
- Click "Start Learning Free" → Registration
- Click "Login" → Login page
- Scroll to pricing → See plans

---

### **STEP 2: Registration**
**URL:** https://algorithm-learn.preview.emergentagent.com/register

**Form Fields:**
1. Full Name
2. Role (Student / Parent / Teacher)
3. Age Group (if Student: Foundation 5-8, Development 9-12, Mastery 13-16)
4. Email
5. Password

**What Happens:**
- Click "Create Account"
- Account created in database
- User automatically logged in
- Redirected based on role:
  - Student → `/dashboard`
  - Parent → `/parent`
  - Teacher → `/teacher`

---

### **STEP 3: Student Dashboard (After Registration)**
**URL:** https://algorithm-learn.preview.emergentagent.com/dashboard

**What Student Sees:**
- Welcome message with their name
- Progress stats (0 activities, 0 points initially)
- Language selector (top-right)
- 🏆 Leaderboard button
- 📚 Activity Library

**Activity Library Shows:**
- ✅ **23 FREE Activities** (can access immediately)
- 🔒 **15 PREMIUM Activities** (marked with "Premium" badge)

**Free Access:**
- Browse and complete 23 free activities
- Earn points (10 per activity)
- Earn badges
- See progress tracking
- Access leaderboard

**Premium Activities:**
- Clicking premium activity shows:
  - "Premium subscription required" message
  - Button: "View Pricing" → redirects to `/pricing`

---

### **STEP 4: Pricing Page**
**URL:** https://algorithm-learn.preview.emergentagent.com/pricing

**3 Subscription Plans:**

#### **Plan 1: Foundation (5-8 years)**
- **Price:** LKR 1,200/month
- **Features:**
  - AI Basics
  - Simple Logic
  - Creative Play
  - Progress Tracking
  - Certificates
  - All 15 Premium Activities

#### **Plan 2: Development (9-12 years)**
- **Price:** LKR 1,800/month
- **Features:**
  - Logical Reasoning
  - AI Applications
  - Design Thinking
  - Complex Problems
  - Certificates
  - All 15 Premium Activities

#### **Plan 3: Mastery (13-16 years)**
- **Price:** LKR 2,800/month
- **Features:**
  - Advanced AI
  - Innovation Methods
  - Leadership Skills
  - Career Guidance
  - Certificates
  - All 15 Premium Activities

**Actions:**
- Click "Subscribe Now" on any plan
- Redirects to Stripe Checkout

---

### **STEP 5: Stripe Checkout**
**External URL:** Stripe hosted checkout page

**What Happens:**
- Student sees Stripe payment form
- Enters card details (Test card: `4242 4242 4242 4242`)
- Stripe processes payment
- On success: Redirects to success page
- On cancel: Returns to pricing page

**Behind the Scenes:**
1. Backend creates Stripe checkout session
2. Stores transaction in `payment_transactions` collection
3. Stripe processes payment
4. Stripe sends webhook to `/api/webhook/stripe`
5. Backend receives webhook:
   - Updates transaction status to "completed"
   - Creates/updates subscription in `subscriptions` collection
   - Sets `status: "active"`, `expires_at: 30 days from now`

---

### **STEP 6: Subscription Success Page**
**URL:** https://algorithm-learn.preview.emergentagent.com/subscription-success?session_id=xxx

**What Student Sees:**
- ⏳ "Activating Subscription..." (2 seconds)
- 🎉 "Payment Successful!"
- Message: "Your premium subscription is now active"
- Button: "Go to Dashboard"

**Actions:**
- Click "Go to Dashboard" → Returns to dashboard

---

### **STEP 7: Dashboard After Payment**
**URL:** https://algorithm-learn.preview.emergentagent.com/dashboard

**Now Student Has:**
- ✅ Access to ALL 38 activities (23 free + 15 premium)
- 🔓 No more "Premium" locks
- Can complete premium activities
- Earn points from premium activities
- Full platform access

---

## 🔄 Backend Flow (Technical)

### **Registration:**
```
POST /api/register
→ Create user in `users` collection
→ Hash password
→ If student: Create `progress` document
→ Return user object
```

### **Payment Flow:**
```
1. POST /api/subscriptions/checkout?plan_id=foundation_monthly
   → Create Stripe checkout session
   → Store transaction (status: "initiated")
   → Return checkout URL

2. User completes payment on Stripe

3. POST /api/webhook/stripe (Stripe calls this)
   → Verify webhook signature
   → Update transaction (status: "completed")
   → Create/update subscription:
      {
        user_id: "xxx",
        plan_id: "foundation_monthly",
        status: "active",
        expires_at: now + 30 days
      }

4. GET /api/subscriptions/status/{session_id}
   → Check if payment successful
   → Return status
```

### **Checking Premium Access:**
```
Student tries to view premium activity:

1. GET /api/activities/{id}
   → Returns activity

2. POST /api/completions?activity_id=xxx
   → If activity.is_premium = true:
      → Check user's subscription
      → If no active subscription:
         → Return 403 "Premium subscription required"
      → If active subscription:
         → Allow completion
         → Award points
```

---

## 🗄️ Database Structure

### **Collections:**

**1. users**
```json
{
  "id": "user_123",
  "email": "student@example.com",
  "full_name": "John Doe",
  "role": "student",
  "age_group": "5-8",
  "language": "en",
  "hashed_password": "...",
  "created_at": "2024-03-05T..."
}
```

**2. subscriptions**
```json
{
  "user_id": "user_123",
  "plan_id": "foundation_monthly",
  "status": "active",
  "started_at": "2024-03-05T...",
  "expires_at": "2024-04-05T..."
}
```

**3. payment_transactions**
```json
{
  "id": "txn_123",
  "session_id": "cs_test_xxx",
  "amount": 1200.00,
  "currency": "lkr",
  "status": "completed",
  "payment_status": "paid",
  "metadata": {
    "user_id": "user_123",
    "plan_id": "foundation_monthly"
  },
  "created_at": "2024-03-05T...",
  "completed_at": "2024-03-05T..."
}
```

**4. activities**
```json
{
  "id": "act_123",
  "title": "Human Sorting Algorithm",
  "is_premium": false,
  "age_group": "5-8",
  "topic": "algorithms",
  ...
}
```

**5. completions**
```json
{
  "id": "comp_123",
  "student_id": "user_123",
  "activity_id": "act_123",
  "completed_at": "2024-03-05T...",
  "time_spent_minutes": 15
}
```

**6. progress**
```json
{
  "student_id": "user_123",
  "activities_completed": 5,
  "points": 50,
  "total_time_spent": 75,
  "badges_earned": [
    {
      "id": "badge_1",
      "name": "First Steps",
      "icon": "🎯"
    }
  ]
}
```

---

## 🧪 Testing the Flow

### **Test Registration:**
```
1. Go to: https://algorithm-learn.preview.emergentagent.com/register
2. Fill form:
   - Name: Test Student
   - Role: Student
   - Age: Foundation (5-8 years)
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"
4. Should redirect to dashboard
```

### **Test Pricing:**
```
1. From dashboard, click premium activity
2. See "Premium required" message
3. Click "View Pricing"
4. Should see 3 plans
```

### **Test Payment (TEST MODE):**
```
1. Click "Subscribe Now" on any plan
2. Redirected to Stripe
3. Use test card:
   - Number: 4242 4242 4242 4242
   - Expiry: 12/34
   - CVC: 123
4. Complete payment
5. Redirected to success page
6. Return to dashboard
7. Premium activities now unlocked!
```

---

## 📍 All Important URLs

| Page | URL | Who Can Access |
|------|-----|----------------|
| **Landing** | `/` | Everyone |
| **Register** | `/register` | Not logged in |
| **Login** | `/login` | Not logged in |
| **Student Dashboard** | `/dashboard` | Students only |
| **Parent Dashboard** | `/parent` | Parents only |
| **Teacher Dashboard** | `/teacher` | Teachers only |
| **Pricing** | `/pricing` | Everyone |
| **Activity Detail** | `/activity/{id}` | Logged in users |
| **Leaderboard** | `/leaderboard` | Logged in users |
| **Success** | `/subscription-success` | After payment |

---

## ✅ What Each User Role Gets

### **👨‍🎓 Student (Free)**
- 23 free activities
- Progress tracking
- Points & badges
- Leaderboard
- Certificates (after 5 activities)
- 13 languages
- Voice features

### **👨‍🎓 Student (Premium)**
- ALL 38 activities (23 + 15 premium)
- Everything from free tier
- Advanced activities
- Full access to all topics

### **👨‍👩‍👧 Parent**
- Link children accounts
- View all children's progress
- Monitor activities completed
- See points, badges, time spent
- Manage subscriptions

### **👨‍🏫 Teacher**
- Create custom activities
- Upload activity images
- View created activities
- Pending approval workflow
- Class management

### **🔧 Admin**
- All teacher features
- Publish/unpublish activities
- User management
- Platform analytics
- Content moderation

---

## 🎉 Summary

**Complete Journey:**
1. **Register** (30 seconds)
2. **Explore Free** (23 activities)
3. **Want More** (see premium activities)
4. **Choose Plan** (pricing page)
5. **Pay via Stripe** (secure checkout)
6. **Get Premium** (instant activation)
7. **Learn Everything!** (all 38 activities)

**Payment processed in real-time, subscription activates immediately!**
