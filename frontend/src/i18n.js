import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "dashboard": "Dashboard",
      "activities": "Activities",
      "progress": "Progress",
      "logout": "Logout",
      "login": "Login",
      "register": "Register",
      
      // Landing Page
      "hero.title": "Futuristic Global AI Academy",
      "hero.subtitle": "Future Leaders Meeting Place - Learn AI & Computer Science through innovative hands-on activities",
      "hero.cta": "Start Learning Free",
      "features.algorithms": "Algorithms",
      "features.algorithms.desc": "Sorting, searching, and problem-solving through physical activities",
      "features.ai": "AI & ML",
      "features.ai.desc": "Pattern recognition, decision trees, and neural networks",
      "features.data": "Data & Logic",
      "features.data.desc": "Binary, logic gates, encryption, and compression",
      
      // Dashboard
      "welcome": "Welcome",
      "ready": "Ready to learn something new?",
      "stats.activities": "Activities",
      "stats.points": "Points",
      "stats.time": "Time Spent",
      "stats.badges": "Badges",
      "congrats": "Congratulations!",
      "certificate.message": "You've completed {{count}} activities! Download your certificate.",
      "certificate.download": "Download Certificate",
      
      // Activities
      "activity.start": "Start Activity",
      "activity.complete": "Mark as Complete",
      "activity.instructions": "Instructions",
      "activity.objectives": "Learning Objectives",
      "activity.completed": "Activity Completed!",
      "activity.back": "Back to Activities",
      "filter.all": "All",
      "filter.mylevel": "My Level",
      
      // Auth
      "auth.create": "Create Account",
      "auth.welcome": "Welcome Back",
      "auth.fullname": "Full Name",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.role": "I am a",
      "auth.student": "Student",
      "auth.parent": "Parent",
      "auth.teacher": "Teacher",
      "auth.agelevel": "Age Level",
      "auth.foundation": "Foundation (5-8 years)",
      "auth.development": "Development (9-12 years)",
      "auth.mastery": "Mastery (13-16 years)",
      
      // Voice
      "voice.play": "🔊 Listen",
      "voice.stop": "⏸️ Stop",
      "voice.language": "Language"
    }
  },
  
  ta: {
    translation: {
      "home": "முகப்பு",
      "dashboard": "டாஷ்போர்டு",
      "activities": "செயல்பாடுகள்",
      "progress": "முன்னேற்றம்",
      "logout": "வெளியேறு",
      "login": "உள்நுழைய",
      "register": "பதிவு செய்க",
      "hero.title": "எதிர்காலவாதி உலகளாவிய AI அகாடமி",
      "hero.subtitle": "எதிர்கால தலைவர்கள் சந்திப்பு இடம் - புதுமையான செயல்பாடுகள் மூலம் AI மற்றும் கணினி அறிவியலைக் கற்றுக்கொள்ளுங்கள்",
      "hero.cta": "இலவசமாக கற்க தொடங்குங்கள்",
      "welcome": "வரவேற்கிறோம்",
      "ready": "புதிதாக ஏதாவது கற்க தயாரா?",
      "stats.activities": "செயல்பாடுகள்",
      "stats.points": "புள்ளிகள்",
      "stats.time": "செலவழித்த நேரம்",
      "stats.badges": "பேட்ஜ்கள்",
      "activity.start": "செயல்பாட்டைத் தொடங்கு",
      "activity.complete": "முடிந்ததாகக் குறி",
      "activity.instructions": "வழிமுறைகள்",
      "activity.objectives": "கற்றல் நோக்கங்கள்"
    }
  },
  
  si: {
    translation: {
      "home": "මුල් පිටුව",
      "dashboard": "උපකරණ පුවරුව",
      "activities": "ක්‍රියාකාරකම්",
      "progress": "ප්‍රගතිය",
      "logout": "ඉවත් වන්න",
      "login": "ඇතුළු වන්න",
      "register": "ලියාපදිංචි වන්න",
      "hero.title": "අනාගතවාදී ගෝලීය AI ඇකඩමිය",
      "hero.subtitle": "අනාගත නායකයින්ගේ රැස්වීම් ස්ථානය - නව්‍ය ක්‍රියාකාරකම් හරහා AI සහ පරිගණක විද්‍යාව ඉගෙන ගන්න",
      "hero.cta": "නොමිලේ ඉගෙනීම ආරම්භ කරන්න",
      "welcome": "සාදරයෙන් පිළිගනිමු",
      "ready": "අලුත් දෙයක් ඉගෙන ගන්න සූදානම්ද?",
      "stats.activities": "ක්‍රියාකාරකම්",
      "stats.points": "ලකුණු",
      "stats.time": "ගත කළ කාලය",
      "stats.badges": "ලාංඡන",
      "activity.start": "ක්‍රියාකාරකම ආරම්භ කරන්න",
      "activity.complete": "සම්පූර්ණ යැයි සලකුණු කරන්න"
    }
  },
  
  hi: {
    translation: {
      "home": "होम",
      "dashboard": "डैशबोर्ड",
      "activities": "गतिविधियाँ",
      "progress": "प्रगति",
      "logout": "लॉग आउट",
      "login": "लॉगिन",
      "register": "पंजीकरण करें",
      "hero.title": "फ्यूचरिस्टिक ग्लोबल AI अकादमी",
      "hero.subtitle": "भविष्य के नेताओं का मिलन स्थल - नवीन गतिविधियों के माध्यम से AI और कंप्यूटर विज्ञान सीखें",
      "hero.cta": "मुफ्त में सीखना शुरू करें",
      "welcome": "स्वागत है",
      "ready": "कुछ नया सीखने के लिए तैयार?",
      "stats.activities": "गतिविधियाँ",
      "stats.points": "अंक",
      "stats.time": "बिताया गया समय",
      "stats.badges": "बैज",
      "activity.start": "गतिविधि शुरू करें",
      "activity.complete": "पूर्ण के रूप में चिह्नित करें"
    }
  },
  
  ms: {
    translation: {
      "home": "Laman Utama",
      "dashboard": "Papan Pemuka",
      "activities": "Aktiviti",
      "progress": "Kemajuan",
      "logout": "Log Keluar",
      "login": "Log Masuk",
      "register": "Daftar",
      "hero.title": "Akademi AI Tanpa Plug",
      "hero.subtitle": "Belajar AI & Sains Komputer melalui aktiviti hands-on yang menyeronokkan — tanpa komputer!",
      "hero.cta": "Mula Belajar Percuma",
      "welcome": "Selamat Datang",
      "ready": "Bersedia untuk belajar sesuatu yang baru?",
      "stats.activities": "Aktiviti",
      "stats.points": "Mata",
      "stats.time": "Masa Dihabiskan",
      "stats.badges": "Lencana"
    }
  },
  
  tl: {
    translation: {
      "home": "Home",
      "dashboard": "Dashboard",
      "activities": "Mga Aktibidad",
      "progress": "Pag-unlad",
      "logout": "Mag-logout",
      "login": "Mag-login",
      "register": "Magrehistro",
      "hero.title": "Unplugged AI Academy",
      "hero.subtitle": "Matuto ng AI at Computer Science sa pamamagitan ng masayang hands-on na mga aktibidad — walang kailangang computer!",
      "hero.cta": "Magsimulang Matuto Nang Libre",
      "welcome": "Maligayang pagdating",
      "ready": "Handa ka na bang matuto ng bagong bagay?",
      "stats.activities": "Mga Aktibidad",
      "stats.points": "Puntos",
      "stats.time": "Oras na Ginugol"
    }
  },
  
  zh: {
    translation: {
      "home": "首页",
      "dashboard": "仪表板",
      "activities": "活动",
      "progress": "进度",
      "logout": "登出",
      "login": "登录",
      "register": "注册",
      "hero.title": "无插件人工智能学院",
      "hero.subtitle": "通过有趣的动手活动学习人工智能和计算机科学——无需电脑！",
      "hero.cta": "免费开始学习",
      "welcome": "欢迎",
      "ready": "准备学习新东西了吗？",
      "stats.activities": "活动",
      "stats.points": "积分",
      "stats.time": "花费时间",
      "stats.badges": "徽章"
    }
  },
  
  th: {
    translation: {
      "home": "หน้าแรก",
      "dashboard": "แดชบอร์ด",
      "activities": "กิจกรรม",
      "progress": "ความคืบหน้า",
      "logout": "ออกจากระบบ",
      "login": "เข้าสู่ระบบ",
      "register": "ลงทะเบียน",
      "hero.title": "Unplugged AI Academy",
      "hero.subtitle": "เรียนรู้ AI และวิทยาการคอมพิวเตอร์ผ่านกิจกรรมแบบ hands-on ที่สนุก — ไม่ต้องใช้คอมพิวเตอร์!",
      "hero.cta": "เริ่มเรียนฟรี",
      "welcome": "ยินดีต้อนรับ",
      "ready": "พร้อมที่จะเรียนรู้สิ่งใหม่แล้วหรือยัง?",
      "stats.activities": "กิจกรรม",
      "stats.points": "คะแนน"
    }
  },
  
  ur: {
    translation: {
      "home": "ہوم",
      "dashboard": "ڈیش بورڈ",
      "activities": "سرگرمیاں",
      "progress": "پیش رفت",
      "logout": "لاگ آؤٹ",
      "login": "لاگ ان",
      "register": "رجسٹر کریں",
      "hero.title": "ان پلگڈ AI اکیڈمی",
      "hero.subtitle": "کمپیوٹر کے بغیر مزے دار، ہاتھوں سے کی جانے والی سرگرمیوں کے ذریعے AI اور کمپیوٹر سائنس سیکھیں!",
      "hero.cta": "مفت سیکھنا شروع کریں",
      "welcome": "خوش آمدید",
      "ready": "کچھ نیا سیکھنے کے لیے تیار ہیں?",
      "stats.activities": "سرگرمیاں",
      "stats.points": "پوائنٹس"
    }
  },
  
  bn: {
    translation: {
      "home": "হোম",
      "dashboard": "ড্যাশবোর্ড",
      "activities": "কার্যক্রম",
      "progress": "অগ্রগতি",
      "logout": "লগ আউট",
      "login": "লগইন",
      "register": "নিবন্ধন করুন",
      "hero.title": "আনপ্লাগড AI একাডেমি",
      "hero.subtitle": "কম্পিউটার ছাড়াই মজার, হাতে-কলমে কার্যক্রমের মাধ্যমে AI এবং কম্পিউটার বিজ্ঞান শিখুন!",
      "hero.cta": "বিনামূল্যে শেখা শুরু করুন",
      "welcome": "স্বাগতম",
      "ready": "নতুন কিছু শিখতে প্রস্তুত?",
      "stats.activities": "কার্যক্রম",
      "stats.points": "পয়েন্ট"
    }
  },
  
  'zh-TW': {
    translation: {
      "home": "首頁",
      "dashboard": "儀表板",
      "activities": "活動",
      "progress": "進度",
      "logout": "登出",
      "login": "登入",
      "register": "註冊",
      "hero.title": "無插件人工智慧學院",
      "hero.subtitle": "通過有趣的動手活動學習人工智慧和電腦科學——無需電腦！",
      "hero.cta": "免費開始學習",
      "welcome": "歡迎",
      "ready": "準備學習新東西了嗎？",
      "stats.activities": "活動",
      "stats.points": "積分"
    }
  },
  
  ko: {
    translation: {
      "home": "홈",
      "dashboard": "대시보드",
      "activities": "활동",
      "progress": "진행 상황",
      "logout": "로그아웃",
      "login": "로그인",
      "register": "등록",
      "hero.title": "언플러그드 AI 아카데미",
      "hero.subtitle": "컴퓨터 없이 재미있는 실습 활동을 통해 AI와 컴퓨터 과학을 배우세요!",
      "hero.cta": "무료로 학습 시작",
      "welcome": "환영합니다",
      "ready": "새로운 것을 배울 준비가 되셨나요?",
      "stats.activities": "활동",
      "stats.points": "포인트"
    }
  },
  
  ja: {
    translation: {
      "home": "ホーム",
      "dashboard": "ダッシュボード",
      "activities": "アクティビティ",
      "progress": "進捗",
      "logout": "ログアウト",
      "login": "ログイン",
      "register": "登録",
      "hero.title": "アンプラグド AI アカデミー",
      "hero.subtitle": "コンピューターを使わずに、楽しい体験型アクティビティを通じてAIとコンピューターサイエンスを学びましょう！",
      "hero.cta": "無料で学習を始める",
      "welcome": "ようこそ",
      "ready": "新しいことを学ぶ準備はできていますか？",
      "stats.activities": "アクティビティ",
      "stats.points": "ポイント"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
