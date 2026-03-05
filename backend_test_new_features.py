#!/usr/bin/env python3
"""
Test new Phase 3-4 features: Parent Dashboard, Teacher Dashboard, Leaderboard
"""

import requests
import sys
from datetime import datetime

class NewFeaturesTester:
    def __init__(self, base_url="https://learn-unplugged-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tokens = {}
        self.test_data = {}
        self.tests_run = 0
        self.tests_passed = 0

    def log_test(self, name: str, success: bool, details: str = ""):
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {name}")
        if details:
            print(f"     └── {details}")
        if success:
            self.tests_passed += 1

    def make_request(self, method: str, endpoint: str, data=None, user_type=None, expected_status=200):
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        if user_type and user_type in self.tokens:
            headers['Authorization'] = f'Bearer {self.tokens[user_type]}'
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
                
            return response.status_code == expected_status, response_data
        except Exception as e:
            return False, str(e)

    def setup_test_users(self):
        """Create and login test users"""
        timestamp = datetime.now().strftime("%H%M%S")
        
        # Create parent and student
        parent_data = {
            "role": "parent",
            "email": f"parent_new_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": f"Test Parent New {timestamp}"
        }
        
        student_data = {
            "role": "student",
            "email": f"student_new_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": f"Test Student New {timestamp}",
            "age_group": "9-12"
        }
        
        teacher_data = {
            "role": "teacher",
            "email": f"teacher_new_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": f"Test Teacher New {timestamp}"
        }
        
        # Register users
        for user_data in [parent_data, student_data, teacher_data]:
            success, response = self.make_request("POST", "/register", user_data)
            if success:
                self.test_data[f"{user_data['role']}_user"] = user_data
                
        # Login users  
        for role in ['parent', 'student', 'teacher']:
            if f"{role}_user" in self.test_data:
                user_data = self.test_data[f"{role}_user"]
                login_data = {"email": user_data["email"], "password": user_data["password"]}
                success, response = self.make_request("POST", "/login", login_data)
                if success and "access_token" in response:
                    self.tokens[role] = response["access_token"]

    def test_leaderboard(self):
        """Test leaderboard functionality"""
        success, leaderboard = self.make_request("GET", "/leaderboard")
        
        if success and isinstance(leaderboard, list):
            self.log_test("Leaderboard Endpoint", True, f"Found {len(leaderboard)} entries")
            
            # Check leaderboard structure
            if leaderboard:
                entry = leaderboard[0]
                required_fields = ['rank', 'student_name', 'points', 'activities_completed']
                if all(field in entry for field in required_fields):
                    self.log_test("Leaderboard Structure", True, f"Top player: {entry['student_name']} ({entry['points']} pts)")
                else:
                    self.log_test("Leaderboard Structure", False, f"Missing fields in entry")
            else:
                self.log_test("Leaderboard Content", True, "Empty leaderboard (expected for new system)")
            return True
        else:
            self.log_test("Leaderboard Endpoint", False, str(leaderboard))
            return False

    def test_parent_link_child(self):
        """Test parent linking child functionality"""
        if 'parent' not in self.tokens or 'student_user' not in self.test_data:
            self.log_test("Parent Link Child", False, "Missing parent or student")
            return False
            
        student_email = self.test_data['student_user']['email']
        success, response = self.make_request(
            "POST", f"/parent/link-child?student_email={student_email}", 
            user_type="parent"
        )
        
        if success:
            self.log_test("Parent Link Child", True, "Child linked successfully")
            return True
        else:
            self.log_test("Parent Link Child", False, str(response))
            return False

    def test_parent_get_children(self):
        """Test parent viewing children's progress"""
        if 'parent' not in self.tokens:
            self.log_test("Parent Get Children", False, "Parent not logged in")
            return False
            
        success, children = self.make_request("GET", "/parent/children", user_type="parent")
        
        if success and isinstance(children, list):
            self.log_test("Parent Get Children", True, f"Found {len(children)} linked children")
            
            if children:
                child = children[0]
                if 'student' in child and 'progress' in child:
                    self.log_test("Parent View Child Progress", True, 
                                 f"Child: {child['student']['full_name']}, Activities: {child['progress']['activities_completed']}")
                else:
                    self.log_test("Parent View Child Progress", False, "Missing student or progress data")
            return True
        else:
            self.log_test("Parent Get Children", False, str(children))
            return False

    def test_teacher_create_activity(self):
        """Test teacher creating new activity"""
        if 'teacher' not in self.tokens:
            self.log_test("Teacher Create Activity", False, "Teacher not logged in")
            return False
            
        activity_data = {
            "title": f"Test Activity {datetime.now().strftime('%H%M%S')}",
            "description": "A test activity for automation testing",
            "age_group": "9-12",
            "topic": "algorithms", 
            "difficulty": "beginner",
            "activity_type": "physical",
            "estimated_time": 20,
            "is_premium": False,
            "instructions": ["Step 1: Test instruction", "Step 2: Another step"],
            "learning_objectives": ["Test objective 1", "Test objective 2"]
        }
        
        success, response = self.make_request("POST", "/activities", activity_data, user_type="teacher")
        
        if success and isinstance(response, dict) and 'id' in response:
            self.test_data['created_activity_id'] = response['id']
            self.log_test("Teacher Create Activity", True, f"Activity ID: {response['id']}")
            return True
        else:
            self.log_test("Teacher Create Activity", False, str(response))
            return False

    def test_language_update(self):
        """Test language preference update"""
        if 'student' not in self.tokens:
            self.log_test("Language Update", False, "Student not logged in")
            return False
            
        success, response = self.make_request("PATCH", "/me/language", {"language": "ta"}, user_type="student")
        
        if success:
            self.log_test("Language Update", True, "Language updated to Tamil")
            return True
        else:
            self.log_test("Language Update", False, str(response))
            return False

    def run_new_features_tests(self):
        """Run all new feature tests"""
        print("🚀 Testing New Phase 3-4 Features")
        print("=" * 50)
        
        print("\n👥 Setting up test users...")
        self.setup_test_users()
        
        print("\n🏆 Leaderboard Tests")
        self.test_leaderboard()
        
        print("\n👨‍👩‍👧 Parent Dashboard Tests")
        self.test_parent_link_child()
        self.test_parent_get_children()
        
        print("\n🎓 Teacher Dashboard Tests")
        self.test_teacher_create_activity()
        
        print("\n🌍 Language Tests")
        self.test_language_update()
        
        print("\n" + "=" * 50)
        print(f"📊 NEW FEATURES TEST SUMMARY")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"   Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80

def main():
    tester = NewFeaturesTester()
    success = tester.run_new_features_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())