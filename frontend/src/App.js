import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Lucide icons
import { 
  Sparkles, Trophy, BookOpen, Users, Settings, LogOut, Menu, X,
  ArrowRight, CheckCircle, Clock, Star, Brain, Cpu, Database,
  Play, Award, TrendingUp, User, Home, Plus, Upload, Check
} from 'lucide-react';

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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext(null);

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 text-6xl">🎓</div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
              Unplugged AI Academy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Learn AI & Computer Science through fun, hands-on activities — no computers needed!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg button-hover"
                onClick={() => navigate('/register')}
                data-testid="primary-cta-start-free-button"
              >
                Start Learning Free <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg button-hover"
                onClick={() => navigate('/login')}
              >
                Login
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
                <h3 className="text-xl font-semibold mb-2">Algorithms</h3>
                <p className="text-muted-foreground">Sorting, searching, and problem-solving through physical activities</p>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Cpu className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">AI & ML</h3>
                <p className="text-muted-foreground">Pattern recognition, decision trees, and neural networks</p>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="pt-6">
                <Database className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Data & Logic</h3>
                <p className="text-muted-foreground">Binary, logic gates, encryption, and compression</p>
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
              <h1 className="text-3xl font-bold">Welcome, {user?.full_name}! 👋</h1>
              <p className="text-muted-foreground">Ready to learn something new?</p>
            </div>
            <Button variant="ghost" onClick={logout} data-testid="logout-button">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
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

// Activity Detail Page
const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const { data } = await axios.get(`${API}/activities/${id}`);
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

            <div>
              <h3 className="text-xl font-semibold mb-3">📋 Instructions</h3>
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
              <h3 className="text-xl font-semibold mb-3">🎯 Learning Objectives</h3>
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

// Fix import
import { useParams } from 'react-router-dom';

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
