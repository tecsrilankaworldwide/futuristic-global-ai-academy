import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import './i18n';
import './App.css';

// Import useAuth hook
import { useAuth } from './hooks/useAuth';

// Lucide icons
import { 
  Sparkles, Trophy, BookOpen, Users, Settings, LogOut, Menu, X,
  ArrowRight, CheckCircle, Clock, Star, Brain, Cpu, Database,
  Play, Award, TrendingUp, User, Home, Plus, Upload, Check, Volume2, ArrowLeft,
  CreditCard, QrCode, Wallet, ChevronLeft, ChevronRight
} from 'lucide-react';

// Components
import LanguageSelector from './components/LanguageSelector';
import VoicePlayer from './components/VoicePlayer';

// Pages
import ParentDashboard from './pages/ParentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Leaderboard from './pages/Leaderboard';

// ShadCN UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Progress } from './components/ui/progress';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Auth Context - export so it can be used in hooks
export const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API}/me`);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    setToken(tokenData);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Header with Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <div className="hero-gradient min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 text-6xl">🚀</div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl font-semibold text-primary/80 mb-2">
              Future Leaders Meeting Place
            </p>
            <p className="text-xl md:text-2xl font-bold text-secondary-foreground mb-4 flex items-center justify-center gap-2">
              <span className="text-3xl">🧠</span> Unplugged AI Academy - Compute With Your Brain
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg button-hover"
                onClick={() => navigate('/register')}
                data-testid="primary-cta-start-free-button"
              >
                {t('hero.cta')} <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg button-hover"
                onClick={() => navigate('/login')}
              >
                {t('login')}
              </Button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-20"
          >
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Brain className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{t('features.algorithms')}</h3>
                <p className="text-muted-foreground">{t('features.algorithms.desc')}</p>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Cpu className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{t('features.ai')}</h3>
                <p className="text-muted-foreground">{t('features.ai.desc')}</p>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Database className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{t('features.data')}</h3>
                <p className="text-muted-foreground">{t('features.data.desc')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Foundation', age: '5-8 years', price: '1200', color: 'coral' },
              { name: 'Development', age: '9-12 years', price: '1800', color: 'sunshine' },
              { name: 'Mastery', age: '13-16 years', price: '2800', color: 'ocean' }
            ].map((plan) => (
              <Card key={plan.name} className="card-shadow">
                <CardHeader>
                  <Badge className="w-fit mb-2">{plan.age}</Badge>
                  <CardTitle>{plan.name} Level</CardTitle>
                  <CardDescription className="text-3xl font-bold text-primary mt-2">
                    LKR {plan.price}/mo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full button-hover" onClick={() => navigate('/register')}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Pages
const AuthPage = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [ageGroup, setAgeGroup] = useState('5-8');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        await axios.post(`${API}/register`, {
          email,
          password,
          full_name: fullName,
          role,
          age_group: role === 'student' ? ageGroup : null
        });
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        const { data } = await axios.post(`${API}/login`, { email, password });
        login(data.access_token, data.user);
        toast.success('Welcome back!');
        
        // Navigate based on role
        if (data.user.role === 'student') navigate('/dashboard');
        else if (data.user.role === 'parent') navigate('/parent');
        else if (data.user.role === 'teacher') navigate('/teacher');
        else if (data.user.role === 'admin') navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md card-shadow">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'register' ? 'Start your learning journey' : 'Login to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    data-testid="register-fullname-input"
                  />
                </div>
                <div>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    data-testid="register-role-select"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
                {role === 'student' && (
                  <div>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      data-testid="register-agegroup-select"
                    >
                      <option value="5-8">Foundation (5-8 years)</option>
                      <option value="9-12">Development (9-12 years)</option>
                      <option value="13-16">Mastery (13-16 years)</option>
                    </select>
                  </div>
                )}
              </>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="auth-email-input"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="auth-password-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full button-hover" 
              disabled={loading}
              data-testid="auth-submit-button"
            >
              {loading ? 'Please wait...' : (mode === 'register' ? 'Create Account' : 'Login')}
            </Button>
          </form>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            {mode === 'register' ? (
              <>Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></>
            ) : (
              <>Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link></>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Student Dashboard
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
    fetchProgress();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.age_group = user.age_group;
      const { data } = await axios.get(`${API}/activities`, { params });
      setActivities(data);
    } catch (error) {
      toast.error('Failed to fetch activities');
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${API}/progress`);
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress');
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await axios.post(`${API}/certificates/generate`, {}, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${user.full_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Certificate downloaded!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate certificate');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{t('welcome')}, {user?.full_name}! 👋</h1>
              <p className="text-muted-foreground">{t('ready')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/leaderboard')} data-testid="leaderboard-button">
                <Trophy className="mr-2 h-4 w-4" /> Leaderboard
              </Button>
              <LanguageSelector />
              <Button variant="ghost" onClick={logout} data-testid="logout-button">
                <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Stats */}
        {progress && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activities</p>
                    <p className="text-3xl font-bold text-primary">{progress.activities_completed}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-3xl font-bold text-primary">{progress.points || 0}</p>
                  </div>
                  <Star className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-3xl font-bold text-primary">{progress.total_time_spent}m</p>
                  </div>
                  <Clock className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Badges</p>
                    <p className="text-3xl font-bold text-primary">{progress.badges_earned?.length || 0}</p>
                  </div>
                  <Award className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Certificate Button */}
        {progress && progress.activities_completed >= 5 && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/20 border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">🎉 Congratulations!</h3>
                  <p className="text-muted-foreground">You've completed {progress.activities_completed} activities! Download your certificate.</p>
                </div>
                <Button onClick={downloadCertificate} data-testid="download-certificate-button">
                  <Award className="mr-2 h-4 w-4" /> Download Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Activities</h2>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="myage">My Level</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="activity-card cursor-pointer" onClick={() => navigate(`/activity/${activity.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{activity.age_group}</Badge>
                    {activity.is_premium && <Badge variant="destructive">Premium</Badge>}
                  </div>
                  <CardTitle className="line-clamp-2">{activity.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> {activity.estimated_time}min</span>
                    <span className="capitalize">{activity.difficulty}</span>
                  </div>
                  <Button className="w-full mt-4 button-hover" data-testid={`activity-start-${activity.id}-button`}>
                    Start Activity <Play className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pricing Page
const PricingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [qrPage, setQrPage] = useState(1);

  const plans = [
    {
      id: 'foundation_monthly',
      name: 'Foundation Level',
      age: '5-8 years',
      price: '1,200',
      features: ['AI Basics', 'Simple Logic', 'Creative Play', 'Progress Tracking', 'Certificates', 'All Premium Activities']
    },
    {
      id: 'development_monthly',
      name: 'Development Level',
      age: '9-12 years',
      price: '1,800',
      features: ['Logical Reasoning', 'AI Applications', 'Design Thinking', 'Complex Problems', 'Certificates', 'All Premium Activities']
    },
    {
      id: 'mastery_monthly',
      name: 'Mastery Level',
      age: '13-16 years',
      price: '2,800',
      features: ['Advanced AI', 'Innovation Methods', 'Leadership Skills', 'Career Guidance', 'Certificates', 'All Premium Activities']
    }
  ];

  const handleSelectPlan = (planId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(planId);
    setPaymentMethod(null);
    setQrPage(1);
    setShowPaymentDialog(true);
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/subscriptions/checkout?plan_id=${selectedPlan}`);
      window.location.href = data.checkout_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start checkout');
      setLoading(false);
    }
  };

  const handlePayPalCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/subscriptions/paypal-checkout`, {
        plan_id: selectedPlan
      });
      if (data.approval_url) {
        window.location.href = data.approval_url;
      } else {
        toast.error('PayPal checkout is being configured. Please try QR Code or Card payment.');
        setLoading(false);
      }
    } catch (error) {
      toast.error('PayPal checkout is being configured. Please try QR Code or Card payment.');
      setLoading(false);
    }
  };

  const handleQrPaymentDone = async () => {
    if (!user || !selectedPlan) return;
    setLoading(true);
    try {
      await axios.post(`${API}/subscriptions/qr-payment-notify`, {
        plan_id: selectedPlan,
        payment_method: 'qr_bank_transfer'
      });
      toast.success('Payment notification sent! Your subscription will be activated after verification.');
      setShowPaymentDialog(false);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to notify. Please contact support.');
      setLoading(false);
    }
  };

  const selectedPlanDetails = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" data-testid="pricing-page-title">Choose Your Plan</h1>
              <p className="text-muted-foreground">Unlock all premium activities and features</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(user ? '/dashboard' : '/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="card-shadow relative">
              <CardHeader>
                <Badge className="w-fit mb-2">{plan.age}</Badge>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-bold text-primary mt-4">
                  LKR {plan.price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full button-hover" 
                  onClick={() => handleSelectPlan(plan.id)}
                  data-testid={`subscribe-${plan.id}-button`}
                >
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods Overview */}
        <div className="mt-12">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Available Payment Methods</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <QrCode className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-center">Bank Transfer (QR)</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-center">Card Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <Wallet className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-center">PayPal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">What's Included in Premium?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">15 Premium Activities</p>
                    <p className="text-sm text-muted-foreground">Advanced concepts and challenges</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">All 13 Languages</p>
                    <p className="text-sm text-muted-foreground">Learn in your native language</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Voice Explanations</p>
                    <p className="text-sm text-muted-foreground">Listen to content in any language</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Certificates</p>
                    <p className="text-sm text-muted-foreground">Download achievement certificates</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Method Selection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="payment-dialog-title">
              {paymentMethod ? (
                <button 
                  onClick={() => setPaymentMethod(null)} 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to payment methods
                </button>
              ) : null}
              {!paymentMethod && 'Select Payment Method'}
              {paymentMethod === 'qr' && 'Bank Transfer via QR Code'}
              {paymentMethod === 'card' && 'Card Payment'}
              {paymentMethod === 'paypal' && 'PayPal Payment'}
            </DialogTitle>
            {selectedPlanDetails && !paymentMethod && (
              <DialogDescription>
                <span className="font-semibold text-foreground">{selectedPlanDetails.name}</span> — LKR {selectedPlanDetails.price}/month
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Payment Method Selection */}
          {!paymentMethod && (
            <div className="space-y-3 mt-2">
              <button
                onClick={() => setPaymentMethod('qr')}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
                data-testid="payment-method-qr"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Bank Transfer (QR Code)</p>
                  <p className="text-sm text-muted-foreground">Scan QR code with your banking app</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
                data-testid="payment-method-card"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Card Payment (Visa / MasterCard)</p>
                  <p className="text-sm text-muted-foreground">Pay securely with your credit or debit card</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </button>

              <button
                onClick={() => setPaymentMethod('paypal')}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
                data-testid="payment-method-paypal"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">PayPal</p>
                  <p className="text-sm text-muted-foreground">Pay with your PayPal account or card via PayPal</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </button>
            </div>
          )}

          {/* QR Code Payment View */}
          {paymentMethod === 'qr' && (
            <div className="space-y-4 mt-2">
              {selectedPlanDetails && (
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-2xl font-bold text-primary">LKR {selectedPlanDetails.price}</p>
                  <p className="text-xs text-muted-foreground">{selectedPlanDetails.name} — Monthly</p>
                </div>
              )}
              
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm font-medium text-center mb-2 text-muted-foreground">
                  TEC SRI LANKA WORLD WIDE
                </p>
                <p className="text-xs text-center mb-3 text-muted-foreground">
                  Account: 005000189991653
                </p>
                <div className="flex justify-center items-center relative">
                  <img 
                    src={`/qr_code_page_${qrPage}.png`} 
                    alt="Payment QR Code" 
                    className="max-w-[280px] w-full h-auto rounded-md"
                    data-testid="qr-code-image"
                  />
                </div>
                <div className="flex justify-center items-center gap-4 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQrPage(1)}
                    className={qrPage === 1 ? 'border-primary bg-primary/10' : ''}
                  >
                    QR 1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQrPage(2)}
                    className={qrPage === 2 ? 'border-primary bg-primary/10' : ''}
                  >
                    QR 2
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Open your banking app</li>
                  <li>Scan the QR code above</li>
                  <li>Verify the amount: <span className="font-semibold text-foreground">LKR {selectedPlanDetails?.price}</span></li>
                  <li>Complete the transfer</li>
                  <li>Click "I've Made the Payment" below</li>
                </ol>
              </div>

              <Button 
                className="w-full" 
                onClick={handleQrPaymentDone}
                disabled={loading}
                data-testid="qr-payment-done-button"
              >
                {loading ? 'Notifying...' : "I've Made the Payment"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your subscription will be activated within 24 hours after payment verification.
              </p>
            </div>
          )}

          {/* Card Payment View */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mt-2">
              {selectedPlanDetails && (
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-2xl font-bold text-primary">LKR {selectedPlanDetails.price}</p>
                  <p className="text-xs text-muted-foreground">{selectedPlanDetails.name} — Monthly</p>
                </div>
              )}
              <div className="text-center space-y-3">
                <div className="flex justify-center gap-3">
                  <div className="bg-muted/50 rounded-md px-3 py-2 text-xs font-medium">VISA</div>
                  <div className="bg-muted/50 rounded-md px-3 py-2 text-xs font-medium">MasterCard</div>
                  <div className="bg-muted/50 rounded-md px-3 py-2 text-xs font-medium">AMEX</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to our secure payment processor (Stripe) to complete your payment.
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={handleStripeCheckout}
                disabled={loading}
                data-testid="card-payment-button"
              >
                {loading ? 'Redirecting...' : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay with Card — LKR {selectedPlanDetails?.price}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by Stripe. Your card details are never stored on our servers.
              </p>
            </div>
          )}

          {/* PayPal Payment View */}
          {paymentMethod === 'paypal' && (
            <div className="space-y-4 mt-2">
              {selectedPlanDetails && (
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-2xl font-bold text-primary">LKR {selectedPlanDetails.price}</p>
                  <p className="text-xs text-muted-foreground">{selectedPlanDetails.name} — Monthly</p>
                </div>
              )}
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-[#0070ba]/10 flex items-center justify-center mx-auto">
                  <Wallet className="h-6 w-6 text-[#0070ba]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Pay securely using your PayPal account or any card through PayPal.
                </p>
              </div>
              <Button 
                className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white" 
                onClick={handlePayPalCheckout}
                disabled={loading}
                data-testid="paypal-payment-button"
              >
                {loading ? 'Redirecting to PayPal...' : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" /> Pay with PayPal — LKR {selectedPlanDetails?.price}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Subscription Success Page
const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      if (sessionId) {
        try {
          await axios.get(`${API}/subscriptions/status/${sessionId}`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for webhook
        } catch (error) {
          console.error('Status check error:', error);
        }
      }
      setChecking(false);
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {checking ? (
            <>
              <div className="text-6xl mb-4 animate-bounce">⏳</div>
              <h2 className="text-2xl font-bold mb-2">Activating Subscription...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your payment</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2 text-primary">Payment Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your premium subscription is now active. You have access to all premium activities!
              </p>
              <Button className="w-full" onClick={() => navigate('/dashboard')} data-testid="go-to-dashboard-button">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Import at the top for language names
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'si', name: 'සිංහල' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino' },
  { code: 'zh', name: '简体中文' },
  { code: 'th', name: 'ไทย' },
  { code: 'ur', name: 'اردو' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' }
];

// Activity Detail Page
const ActivityDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [activity, setActivity] = useState(null);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivity();
  }, [id, i18n.language]); // Refetch when language changes

  const fetchActivity = async () => {
    try {
      // Fetch with language parameter for translation
      const { data } = await axios.get(`${API}/activities/${id}?lang=${i18n.language}`);
      setActivity(data);
    } catch (error) {
      toast.error('Activity not found');
      navigate('/dashboard');
    }
  };

  const markComplete = async () => {
    try {
      await axios.post(`${API}/completions?activity_id=${activity.id}&time_spent_minutes=15`);
      setCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Activity completed! +10 points');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to mark complete');
    }
  };

  if (!activity) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          ← Back to Activities
        </Button>

        <Card className="card-shadow">
          <CardHeader>
            <div className="flex gap-2 mb-4">
              <Badge>{activity.age_group}</Badge>
              <Badge variant="secondary">{activity.topic.replace('_', ' ')}</Badge>
              {activity.is_premium && <Badge variant="destructive">Premium</Badge>}
            </div>
            <CardTitle className="text-4xl">{activity.title}</CardTitle>
            <CardDescription className="text-lg">{activity.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activity.image_url && (
              <img src={activity.image_url} alt={activity.title} className="w-full rounded-lg" />
            )}

            {/* Topic Explanation */}
            {activity.topic_explanation_title && (
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                    📚 {activity.topic_explanation_title}
                  </h3>
                  <VoicePlayer text={activity.topic_explanation} />
                </div>
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {activity.topic_explanation}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">📋 {t('activity.instructions')}</h3>
                <VoicePlayer text={activity.instructions.join('. ')} />
              </div>
              <ol className="space-y-2">
                {activity.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">🎯 {t('activity.objectives')}</h3>
                <VoicePlayer text={activity.learning_objectives.join('. ')} />
              </div>
              <ul className="space-y-2">
                {activity.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!completed ? (
              <Button 
                className="w-full h-14 text-lg button-hover" 
                onClick={markComplete}
                data-testid="activity-player-mark-complete-button"
              >
                <Check className="mr-2" /> Mark as Complete
              </Button>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Activity Completed!</h3>
                <p className="text-muted-foreground">Great job! Redirecting to dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/activity/:id" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
          <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/subscription-success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
