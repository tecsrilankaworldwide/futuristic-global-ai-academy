import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { LogOut, TrendingUp, Award, Clock } from 'lucide-react';
import { toast } from 'sonner';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const { data } = await axios.get(`${API}/parent/children`);
      setChildren(data);
    } catch (error) {
      toast.error('Failed to fetch children');
    }
  };

  const linkChild = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/parent/link-child?student_email=${studentEmail}`);
      toast.success('Child linked successfully!');
      setStudentEmail('');
      fetchChildren();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to link child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Parent Dashboard 👨‍👩‍👧</h1>
              <p className="text-muted-foreground">Monitor your children's progress</p>
            </div>
            <div className="flex gap-2">
              <LanguageSelector />
              <Button variant="ghost" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Link Child Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Link a Child Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={linkChild} className="flex gap-4">
              <Input
                type="email"
                placeholder="Child's email address"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
                data-testid="link-child-email-input"
              />
              <Button type="submit" disabled={loading} data-testid="link-child-button">
                {loading ? 'Linking...' : 'Link Child'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Children List */}
        <h2 className="text-2xl font-bold mb-4">Your Children</h2>
        {children.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No children linked yet. Add your child's email above to start tracking their progress.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {children.map(({ student, progress }) => (
              <Card key={student.id} className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {student.full_name}
                    {student.age_group && <span className="text-sm text-muted-foreground">({student.age_group})</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold">{progress.activities_completed}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold">{progress.points || 0}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold">{progress.total_time_spent}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                  </div>
                  
                  {progress.badges_earned && progress.badges_earned.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Recent Badges:</p>
                      <div className="flex flex-wrap gap-2">
                        {progress.badges_earned.slice(0, 3).map((badge, idx) => (
                          <div key={idx} className="bg-secondary px-3 py-1 rounded-full text-sm">
                            {badge.icon} {badge.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
