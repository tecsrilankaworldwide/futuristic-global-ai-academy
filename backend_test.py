#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for AI Unplugged Learning Platform
Tests all core functionality including authentication, activities, progress tracking, 
badges, certificates, and subscription system.
"""

import requests
import sys
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class UnpluggedAPITester:
    def __init__(self, base_url: str = "https://tech-excellence-8.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tokens = {}  # Store tokens for different users
        self.test_data = {}  # Store test data created during tests
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {name}")
        if details:
            print(f"     └── {details}")
        
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"name": name, "details": details})

    def make_request(self, method: str, endpoint: str, data: dict = None, 
                    user_type: str = None, expected_status: int = 200, 
                    response_type: str = "json") -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        # Add authentication if user_type specified
        if user_type and user_type in self.tokens:
            headers['Authorization'] = f'Bearer {self.tokens[user_type]}'
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            # Handle different response types
            if response_type == "blob":
                return response.status_code == expected_status, response.content
            else:
                try:
                    response_data = response.json()
                except:
                    response_data = response.text

                return response.status_code == expected_status, response_data
                
        except requests.exceptions.RequestException as e:
            return False, str(e)

    def test_health_check(self):
        """Test API health endpoint"""
        success, data = self.make_request("GET", "/")
        expected_message = "Unplugged AI Academy API"
        
        if success and isinstance(data, dict) and data.get("message") == expected_message:
            self.log_test("API Health Check", True, f"API version: {data.get('version', 'unknown')}")
            return True
        else:
            self.log_test("API Health Check", False, f"Expected message not found: {data}")
            return False

    def test_user_registration(self):
        """Test user registration for different roles"""
        timestamp = datetime.now().strftime("%H%M%S")
        
        # Test users for different roles
        test_users = [
            {
                "role": "student",
                "email": f"student_{timestamp}@test.com",
                "password": "TestPass123!",
                "full_name": f"Test Student {timestamp}",
                "age_group": "9-12"
            },
            {
                "role": "parent", 
                "email": f"parent_{timestamp}@test.com",
                "password": "TestPass123!",
                "full_name": f"Test Parent {timestamp}"
            },
            {
                "role": "teacher",
                "email": f"teacher_{timestamp}@test.com", 
                "password": "TestPass123!",
                "full_name": f"Test Teacher {timestamp}"
            }
        ]

        all_passed = True
        for user_data in test_users:
            success, response = self.make_request("POST", "/register", user_data, expected_status=200)
            
            if success and isinstance(response, dict):
                # Store user data for later login tests
                self.test_data[f"{user_data['role']}_user"] = user_data
                self.log_test(f"Register {user_data['role'].title()}", True, 
                             f"User ID: {response.get('id', 'unknown')}")
            else:
                self.log_test(f"Register {user_data['role'].title()}", False, str(response))
                all_passed = False

        return all_passed

    def test_user_login(self):
        """Test user login for all registered users"""
        all_passed = True
        
        for role in ['student', 'parent', 'teacher']:
            user_key = f"{role}_user"
            if user_key not in self.test_data:
                self.log_test(f"Login {role.title()}", False, "User not registered")
                all_passed = False
                continue
                
            user_data = self.test_data[user_key]
            login_data = {
                "email": user_data["email"],
                "password": user_data["password"]
            }
            
            success, response = self.make_request("POST", "/login", login_data, expected_status=200)
            
            if success and isinstance(response, dict) and "access_token" in response:
                # Store token for authenticated requests
                self.tokens[role] = response["access_token"]
                user_info = response.get("user", {})
                self.log_test(f"Login {role.title()}", True, 
                             f"Role: {user_info.get('role')}, Name: {user_info.get('full_name')}")
            else:
                self.log_test(f"Login {role.title()}", False, str(response))
                all_passed = False
        
        return all_passed

    def test_get_activities(self):
        """Test activity retrieval with different filters"""
        # Test basic activity list
        success, activities = self.make_request("GET", "/activities")
        
        if success and isinstance(activities, list):
            activity_count = len(activities)
            self.log_test("Get All Activities", True, f"Found {activity_count} activities")
            
            if activity_count >= 18:
                self.log_test("Activity Count Validation", True, f"Expected 18+ activities, found {activity_count}")
            else:
                self.log_test("Activity Count Validation", False, f"Expected 18+ activities, found {activity_count}")
            
            # Store first activity for detail test
            if activities:
                self.test_data['sample_activity'] = activities[0]
                
            # Test filtering by age group
            success_filter, filtered = self.make_request("GET", "/activities?age_group=9-12")
            if success_filter and isinstance(filtered, list):
                self.log_test("Filter by Age Group", True, f"Found {len(filtered)} activities for age 9-12")
            else:
                self.log_test("Filter by Age Group", False, str(filtered))
                
            return success
        else:
            self.log_test("Get All Activities", False, str(activities))
            return False

    def test_get_activity_detail(self):
        """Test individual activity detail retrieval"""
        if 'sample_activity' not in self.test_data:
            self.log_test("Activity Detail", False, "No sample activity available")
            return False
            
        activity_id = self.test_data['sample_activity']['id']
        success, activity = self.make_request("GET", f"/activities/{activity_id}")
        
        if success and isinstance(activity, dict):
            required_fields = ['id', 'title', 'description', 'instructions', 'learning_objectives']
            missing_fields = [field for field in required_fields if field not in activity]
            
            if not missing_fields:
                self.log_test("Activity Detail", True, 
                             f"Title: {activity['title'][:50]}...")
                return True
            else:
                self.log_test("Activity Detail", False, f"Missing fields: {missing_fields}")
                return False
        else:
            self.log_test("Activity Detail", False, str(activity))
            return False

    def test_student_progress(self):
        """Test student progress tracking"""
        if 'student' not in self.tokens:
            self.log_test("Student Progress", False, "Student not logged in")
            return False
            
        success, progress = self.make_request("GET", "/progress", user_type="student")
        
        if success and isinstance(progress, dict):
            expected_fields = ['student_id', 'activities_completed', 'total_time_spent', 'points', 'badges_earned']
            missing_fields = [field for field in expected_fields if field not in progress]
            
            if not missing_fields:
                self.log_test("Get Student Progress", True,
                             f"Activities: {progress['activities_completed']}, Points: {progress['points']}")
                return True
            else:
                self.log_test("Get Student Progress", False, f"Missing fields: {missing_fields}")
                return False
        else:
            self.log_test("Get Student Progress", False, str(progress))
            return False

    def test_mark_activity_complete(self):
        """Test marking an activity as complete and check progress update"""
        if 'student' not in self.tokens or 'sample_activity' not in self.test_data:
            self.log_test("Mark Activity Complete", False, "Prerequisites not met")
            return False
            
        activity_id = self.test_data['sample_activity']['id']
        
        # Get initial progress
        success_before, progress_before = self.make_request("GET", "/progress", user_type="student")
        if not success_before:
            self.log_test("Mark Activity Complete - Get Initial Progress", False, str(progress_before))
            return False
            
        initial_count = progress_before.get('activities_completed', 0)
        initial_points = progress_before.get('points', 0)
        
        # Mark activity complete
        success, result = self.make_request(
            "POST", f"/completions?activity_id={activity_id}&time_spent_minutes=15", 
            user_type="student", expected_status=200
        )
        
        if success and isinstance(result, dict):
            self.log_test("Mark Activity Complete", True, result.get('message', 'Completed'))
            
            # Check progress update
            success_after, progress_after = self.make_request("GET", "/progress", user_type="student")
            if success_after:
                new_count = progress_after.get('activities_completed', 0)
                new_points = progress_after.get('points', 0)
                
                if new_count == initial_count + 1:
                    self.log_test("Progress Update - Activity Count", True, f"{initial_count} → {new_count}")
                else:
                    self.log_test("Progress Update - Activity Count", False, 
                                 f"Expected {initial_count + 1}, got {new_count}")
                
                if new_points == initial_points + 10:
                    self.log_test("Progress Update - Points", True, f"{initial_points} → {new_points}")
                else:
                    self.log_test("Progress Update - Points", False,
                                 f"Expected {initial_points + 10}, got {new_points}")
                                 
                return True
            else:
                self.log_test("Progress Update Check", False, str(progress_after))
                return False
        else:
            self.log_test("Mark Activity Complete", False, str(result))
            return False

    def test_badge_awards(self):
        """Test badge system by completing multiple activities"""
        if 'student' not in self.tokens:
            self.log_test("Badge System", False, "Student not logged in")
            return False
            
        # Get current progress to see badges
        success, progress = self.make_request("GET", "/progress", user_type="student")
        if not success:
            self.log_test("Badge System - Get Progress", False, str(progress))
            return False
            
        badges = progress.get('badges_earned', [])
        activities_completed = progress.get('activities_completed', 0)
        
        # Check if badges match expected based on activities completed
        expected_badges = []
        if activities_completed >= 1:
            expected_badges.append("First Steps")
        if activities_completed >= 5:
            expected_badges.append("Getting Started") 
        if activities_completed >= 10:
            expected_badges.append("Rising Star")
            
        badge_names = [badge.get('name') for badge in badges if isinstance(badge, dict)]
        
        success_status = True
        for expected_badge in expected_badges:
            if expected_badge in badge_names:
                self.log_test(f"Badge Award - {expected_badge}", True, "Badge correctly awarded")
            else:
                self.log_test(f"Badge Award - {expected_badge}", False, f"Expected badge not found")
                success_status = False
                
        if not expected_badges:
            self.log_test("Badge System", True, f"No badges expected yet (activities: {activities_completed})")
            
        return success_status

    def test_certificate_generation(self):
        """Test PDF certificate generation"""
        if 'student' not in self.tokens:
            self.log_test("Certificate Generation", False, "Student not logged in")
            return False
            
        # Check if student has enough activities (5+) for certificate
        success, progress = self.make_request("GET", "/progress", user_type="student")
        if not success:
            self.log_test("Certificate Generation - Check Progress", False, str(progress))
            return False
            
        activities_completed = progress.get('activities_completed', 0)
        
        if activities_completed >= 5:
            # Try to generate certificate
            success, pdf_content = self.make_request(
                "POST", "/certificates/generate", 
                user_type="student", response_type="blob"
            )
            
            if success and pdf_content:
                self.log_test("Certificate Generation", True, f"PDF generated ({len(pdf_content)} bytes)")
                return True
            else:
                self.log_test("Certificate Generation", False, "Failed to generate PDF")
                return False
        else:
            # Try to generate certificate with insufficient activities (should fail)
            success, response = self.make_request(
                "POST", "/certificates/generate", 
                user_type="student", expected_status=400
            )
            
            if success:
                self.log_test("Certificate Generation - Insufficient Activities", True, 
                             "Correctly rejected (need 5+ activities)")
                return True
            else:
                self.log_test("Certificate Generation - Insufficient Activities", False,
                             "Should have rejected request")
                return False

    def test_subscription_plans(self):
        """Test subscription plan retrieval"""
        success, plans = self.make_request("GET", "/subscriptions/plans")
        
        if success and isinstance(plans, list):
            if len(plans) >= 3:  # Foundation, Development, Mastery
                plan_names = [plan.get('name', '') for plan in plans]
                self.log_test("Subscription Plans", True, f"Found {len(plans)} plans: {', '.join(plan_names[:3])}")
                return True
            else:
                self.log_test("Subscription Plans", False, f"Expected 3+ plans, found {len(plans)}")
                return False
        else:
            self.log_test("Subscription Plans", False, str(plans))
            return False

    def test_user_profile(self):
        """Test user profile endpoint"""
        if 'student' not in self.tokens:
            self.log_test("User Profile", False, "Student not logged in")
            return False
            
        success, profile = self.make_request("GET", "/me", user_type="student")
        
        if success and isinstance(profile, dict):
            required_fields = ['id', 'email', 'full_name', 'role']
            missing_fields = [field for field in required_fields if field not in profile]
            
            if not missing_fields:
                self.log_test("User Profile", True, 
                             f"Role: {profile['role']}, Name: {profile['full_name']}")
                return True
            else:
                self.log_test("User Profile", False, f"Missing fields: {missing_fields}")
                return False
        else:
            self.log_test("User Profile", False, str(profile))
            return False

    def run_all_tests(self):
        """Run comprehensive backend test suite"""
        print("🚀 Starting Comprehensive Backend API Tests")
        print("=" * 60)
        
        # Core API Tests
        print("\n📡 API Health & Infrastructure")
        self.test_health_check()
        
        # Authentication Tests
        print("\n🔐 Authentication & User Management")
        self.test_user_registration()
        self.test_user_login()
        self.test_user_profile()
        
        # Activity Tests
        print("\n📚 Activity Management")
        self.test_get_activities()
        self.test_get_activity_detail()
        
        # Progress & Gamification Tests
        print("\n🎯 Progress Tracking & Gamification")
        self.test_student_progress()
        self.test_mark_activity_complete()
        self.test_badge_awards()
        
        # Certification Tests
        print("\n🏆 Certification System")
        self.test_certificate_generation()
        
        # Subscription Tests
        print("\n💳 Subscription Management")
        self.test_subscription_plans()
        
        # Summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"   • {test['name']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n✅ Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80  # Consider 80%+ success as acceptable

def main():
    """Main test execution"""
    try:
        tester = UnpluggedAPITester()
        success = tester.run_all_tests()
        
        # Return appropriate exit code
        return 0 if success else 1
        
    except Exception as e:
        print(f"\n💥 Fatal Error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())