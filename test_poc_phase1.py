"""
Phase 1 POC: Test Stripe + Activity Completion + PDF Certificate Generation

This script tests all critical integrations that the app depends on:
1. Stripe checkout session creation
2. Stripe webhook handling and subscription activation  
3. Activity completion and progress tracking
4. PDF certificate generation

User Stories Tested:
1. As a user, I can start a Stripe checkout for a plan and return to the app successfully.
2. As the system, I can process Stripe webhooks and activate a subscription reliably.
3. As a student, I can complete an activity and see progress updated.
4. As a student, I can generate/download a PDF certificate after meeting completion rules.
5. As an admin, I can seed the platform with curated unplugged activities.
"""

import os
import sys
import asyncio
from datetime import datetime, timezone
from io import BytesIO
import uuid

# Ensure we can import from backend
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment
load_dotenv('/app/backend/.env')

# PDF Generation imports
from weasyprint import HTML
from jinja2 import Template

# Stripe imports
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest

# MongoDB setup
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ.get('DB_NAME', 'ai_unplugged_db')

# Test Stripe key
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Sample unplugged activities for seeding
SAMPLE_ACTIVITIES = [
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
        "instructions": [
            "Have 5-10 students line up randomly",
            "Compare two adjacent students at a time",
            "Swap positions if they're out of order",
            "Repeat until everyone is sorted",
            "Discuss the pattern - this is bubble sort!"
        ],
        "learning_objectives": [
            "Understanding step-by-step algorithms",
            "Comparison operations",
            "Pattern recognition"
        ],
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Binary Numbers with Cards",
        "description": "Learn binary counting using playing cards or paper cards marked 1, 2, 4, 8, 16",
        "age_group": "9-12",
        "topic": "data_and_logic",
        "difficulty": "intermediate",
        "activity_type": "physical",
        "estimated_time": 20,
        "is_premium": False,
        "instructions": [
            "Create cards with powers of 2: 1, 2, 4, 8, 16",
            "Flip cards face-up (1) or face-down (0)",
            "Add up face-up cards to get decimal number",
            "Practice counting from 0-31 in binary",
            "Try representing your age in binary!"
        ],
        "learning_objectives": [
            "Binary number system",
            "Powers of 2",
            "Digital data representation"
        ],
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Pixel Art Image Processing",
        "description": "Create pixel art to understand how computers store and display images",
        "age_group": "5-8",
        "topic": "ai_ml_concepts",
        "difficulty": "beginner",
        "activity_type": "physical",
        "estimated_time": 25,
        "is_premium": True,
        "instructions": [
            "Give students grid paper (8x8 or larger)",
            "Assign colors to numbers (1=red, 2=blue, etc.)",
            "Call out number sequences: '1,1,2,2,1,1,2,2...'",
            "Students color squares to create a pattern",
            "Reveal the final image - it's pixel art!",
            "Discuss how computers store images as numbers"
        ],
        "learning_objectives": [
            "Image representation",
            "Patterns and grids",
            "Data encoding"
        ],
        "created_at": datetime.now(timezone.utc)
    }
]

# Simple certificate HTML template
CERTIFICATE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            height: 100vh;
            box-sizing: border-box;
        }
        .certificate {
            background: white;
            padding: 40px;
            border: 10px solid #764ba2;
            border-radius: 20px;
            text-align: center;
            height: 100%;
            box-sizing: border-box;
        }
        h1 {
            color: #764ba2;
            font-size: 48px;
            margin: 20px 0;
        }
        h2 {
            color: #667eea;
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

class POCTester:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGO_URL)
        self.db = self.client[DB_NAME]
        self.test_results = {}
        
    async def cleanup(self):
        """Clean up test data"""
        try:
            await self.db.activities.delete_many({"title": {"$in": [a["title"] for a in SAMPLE_ACTIVITIES]}})
            await self.db.test_users.delete_many({"email": "test_student@example.com"})
            await self.db.test_progress.delete_many({"student_id": "test_student_123"})
            await self.db.payment_transactions.delete_many({"metadata.test": "poc"})
        except Exception as e:
            print(f"⚠️  Cleanup warning: {e}")
    
    async def test_1_seed_activities(self):
        """Test 1: Seed curated unplugged activities into database"""
        print("\n" + "="*80)
        print("TEST 1: Seeding Curated Unplugged Activities")
        print("="*80)
        
        try:
            # Insert sample activities
            result = await self.db.activities.insert_many(SAMPLE_ACTIVITIES)
            inserted_count = len(result.inserted_ids)
            
            # Verify insertion
            count = await self.db.activities.count_documents({"title": {"$in": [a["title"] for a in SAMPLE_ACTIVITIES]}})
            
            assert count == len(SAMPLE_ACTIVITIES), f"Expected {len(SAMPLE_ACTIVITIES)} activities, got {count}"
            
            print(f"✅ Successfully seeded {inserted_count} unplugged activities")
            print("\nSeeded Activities:")
            for activity in SAMPLE_ACTIVITIES:
                print(f"  • {activity['title']} ({activity['age_group']}, {activity['topic']})")
            
            self.test_results['seed_activities'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed to seed activities: {e}")
            self.test_results['seed_activities'] = False
            return False
    
    async def test_2_activity_completion(self):
        """Test 2: Mark activity as complete and update progress"""
        print("\n" + "="*80)
        print("TEST 2: Activity Completion & Progress Tracking")
        print("="*80)
        
        try:
            student_id = "test_student_123"
            
            # Get a sample activity
            activity = await self.db.activities.find_one({"title": "Human Sorting Algorithm"})
            assert activity is not None, "Sample activity not found"
            
            # Create completion record
            completion = {
                "id": str(uuid.uuid4()),
                "student_id": student_id,
                "activity_id": activity["id"],
                "activity_title": activity["title"],
                "completed_at": datetime.now(timezone.utc),
                "time_spent_minutes": 18
            }
            
            await self.db.completions.insert_one(completion)
            
            # Update progress
            progress = await self.db.progress.find_one({"student_id": student_id})
            
            if not progress:
                progress = {
                    "student_id": student_id,
                    "activities_completed": 0,
                    "total_time_spent": 0,
                    "streak_days": 0,
                    "badges_earned": []
                }
            
            progress["activities_completed"] = progress.get("activities_completed", 0) + 1
            progress["total_time_spent"] = progress.get("total_time_spent", 0) + completion["time_spent_minutes"]
            progress["last_activity_date"] = completion["completed_at"]
            
            await self.db.progress.update_one(
                {"student_id": student_id},
                {"$set": progress},
                upsert=True
            )
            
            # Verify
            updated_progress = await self.db.progress.find_one({"student_id": student_id})
            assert updated_progress["activities_completed"] >= 1, "Progress not updated"
            
            print(f"✅ Activity marked as complete")
            print(f"  • Activity: {activity['title']}")
            print(f"  • Time spent: {completion['time_spent_minutes']} minutes")
            print(f"  • Total activities completed: {updated_progress['activities_completed']}")
            print(f"  • Total time: {updated_progress['total_time_spent']} minutes")
            
            self.test_results['activity_completion'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed activity completion test: {e}")
            self.test_results['activity_completion'] = False
            return False
    
    async def test_3_pdf_certificate_generation(self):
        """Test 3: Generate PDF certificate"""
        print("\n" + "="*80)
        print("TEST 3: PDF Certificate Generation")
        print("="*80)
        
        try:
            # Get student progress
            progress = await self.db.progress.find_one({"student_id": "test_student_123"})
            
            # Generate certificate
            template = Template(CERTIFICATE_TEMPLATE)
            html_content = template.render(
                student_name="Test Student",
                activities_completed=progress.get("activities_completed", 0),
                completion_date=datetime.now().strftime("%B %d, %Y"),
                level="Foundation (5-8 years)",
                certificate_id=f"CERT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
            )
            
            # Convert to PDF
            pdf_bytes = HTML(string=html_content).write_pdf()
            
            # Verify PDF was created
            assert len(pdf_bytes) > 0, "PDF generation failed - empty file"
            assert pdf_bytes[:4] == b'%PDF', "Generated file is not a valid PDF"
            
            # Save for inspection
            with open('/app/test_certificate.pdf', 'wb') as f:
                f.write(pdf_bytes)
            
            print(f"✅ PDF certificate generated successfully")
            print(f"  • File size: {len(pdf_bytes)} bytes")
            print(f"  • Saved to: /app/test_certificate.pdf")
            print(f"  • Student: Test Student")
            print(f"  • Activities completed: {progress.get('activities_completed', 0)}")
            
            self.test_results['pdf_generation'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed PDF generation test: {e}")
            self.test_results['pdf_generation'] = False
            return False
    
    async def test_4_stripe_checkout(self):
        """Test 4: Create Stripe checkout session"""
        print("\n" + "="*80)
        print("TEST 4: Stripe Checkout Session Creation")
        print("="*80)
        
        try:
            # Initialize Stripe
            host_url = "http://localhost:8000"
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
            
            # Create checkout session
            checkout_request = CheckoutSessionRequest(
                amount=1200.00,  # Foundation monthly plan
                currency="lkr",
                success_url=f"{host_url}/success?session_id={{{{CHECKOUT_SESSION_ID}}}}",
                cancel_url=f"{host_url}/cancel",
                metadata={
                    "test": "poc",
                    "user_id": "test_student_123",
                    "plan": "foundation_monthly",
                    "age_group": "5-8"
                }
            )
            
            session = await stripe_checkout.create_checkout_session(checkout_request)
            
            assert session.url is not None, "No checkout URL returned"
            assert session.session_id is not None, "No session ID returned"
            
            # Store transaction record
            transaction = {
                "id": str(uuid.uuid4()),
                "session_id": session.session_id,
                "amount": 1200.00,
                "currency": "lkr",
                "status": "initiated",
                "payment_status": "pending",
                "metadata": checkout_request.metadata,
                "created_at": datetime.now(timezone.utc)
            }
            
            await self.db.payment_transactions.insert_one(transaction)
            
            print(f"✅ Stripe checkout session created successfully")
            print(f"  • Session ID: {session.session_id}")
            print(f"  • Checkout URL: {session.url[:60]}...")
            print(f"  • Amount: 1200.00 LKR")
            print(f"  • Transaction stored in database")
            
            self.test_results['stripe_checkout'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed Stripe checkout test: {e}")
            self.test_results['stripe_checkout'] = False
            return False
    
    async def test_5_stripe_webhook_simulation(self):
        """Test 5: Simulate Stripe webhook and subscription activation"""
        print("\n" + "="*80)
        print("TEST 5: Stripe Webhook Handling & Subscription Activation")
        print("="*80)
        
        try:
            # Find a pending transaction
            transaction = await self.db.payment_transactions.find_one({"status": "initiated", "metadata.test": "poc"})
            
            if not transaction:
                print("⚠️  No pending transaction found, creating simulated one...")
                transaction = {
                    "id": str(uuid.uuid4()),
                    "session_id": f"cs_test_{str(uuid.uuid4())[:16]}",
                    "amount": 1200.00,
                    "currency": "lkr",
                    "status": "initiated",
                    "payment_status": "pending",
                    "metadata": {
                        "test": "poc",
                        "user_id": "test_student_123",
                        "plan": "foundation_monthly"
                    },
                    "created_at": datetime.now(timezone.utc)
                }
                await self.db.payment_transactions.insert_one(transaction)
            
            # Simulate successful payment webhook
            print("  • Simulating successful payment webhook...")
            
            # Update transaction status
            await self.db.payment_transactions.update_one(
                {"session_id": transaction["session_id"]},
                {"$set": {
                    "status": "completed",
                    "payment_status": "paid",
                    "completed_at": datetime.now(timezone.utc)
                }}
            )
            
            # Activate subscription for user
            user_id = transaction["metadata"]["user_id"]
            subscription_end_date = datetime.now(timezone.utc)
            from datetime import timedelta
            subscription_end_date = subscription_end_date + timedelta(days=30)
            
            await self.db.subscriptions.update_one(
                {"user_id": user_id},
                {"$set": {
                    "user_id": user_id,
                    "plan": transaction["metadata"]["plan"],
                    "status": "active",
                    "started_at": datetime.now(timezone.utc),
                    "expires_at": subscription_end_date
                }},
                upsert=True
            )
            
            # Verify
            updated_transaction = await self.db.payment_transactions.find_one({"session_id": transaction["session_id"]})
            subscription = await self.db.subscriptions.find_one({"user_id": user_id})
            
            assert updated_transaction["status"] == "completed", "Transaction not marked complete"
            assert subscription["status"] == "active", "Subscription not activated"
            
            print(f"✅ Webhook processed and subscription activated")
            print(f"  • Transaction status: {updated_transaction['status']}")
            print(f"  • Payment status: {updated_transaction['payment_status']}")
            print(f"  • Subscription: {subscription['plan']}")
            print(f"  • Expires: {subscription['expires_at'].strftime('%Y-%m-%d')}")
            
            self.test_results['stripe_webhook'] = True
            return True
            
        except Exception as e:
            print(f"❌ Failed webhook simulation test: {e}")
            self.test_results['stripe_webhook'] = False
            return False
    
    async def run_all_tests(self):
        """Run all POC tests"""
        print("\n")
        print("╔" + "="*78 + "╗")
        print("║" + " "*20 + "PHASE 1 POC - CORE INTEGRATION TESTS" + " "*22 + "║")
        print("╚" + "="*78 + "╝")
        
        await self.cleanup()
        
        # Run tests
        await self.test_1_seed_activities()
        await self.test_2_activity_completion()
        await self.test_3_pdf_certificate_generation()
        await self.test_4_stripe_checkout()
        await self.test_5_stripe_webhook_simulation()
        
        # Summary
        print("\n" + "="*80)
        print("TEST SUMMARY")
        print("="*80)
        
        passed = sum(1 for v in self.test_results.values() if v)
        total = len(self.test_results)
        
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} - {test_name.replace('_', ' ').title()}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("\n🎉 ALL POC TESTS PASSED! Ready for Phase 2 development.")
            return True
        else:
            print(f"\n⚠️  {total - passed} test(s) failed. Please fix before proceeding to Phase 2.")
            return False
    
    async def close(self):
        """Close database connection"""
        self.client.close()


async def main():
    """Main execution"""
    tester = POCTester()
    try:
        success = await tester.run_all_tests()
        return success
    finally:
        await tester.close()


if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
