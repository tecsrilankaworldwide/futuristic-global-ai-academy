import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LogOut, TrendingUp, Award, Clock, UserPlus, Users, 
  BookOpen, Star, Trash2, ChevronRight, ArrowLeft, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [children, setChildren] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childCompletions, setChildCompletions] = useState([]);
  const [loadingCompletions, setLoadingCompletions] = useState(false);
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

  const unlinkChild = async (studentId) => {
    if (!window.confirm('Are you sure you want to unlink this child?')) return;
    try {
      await axios.delete(`${API}/parent/unlink-child/${studentId}`);
      toast.success('Child unlinked');
      setSelectedChild(null);
      setChildCompletions([]);
      fetchChildren();
    } catch (error) {
      toast.error('Failed to unlink child');
    }
  };

  const viewChildProgress = async (child) => {
    setSelectedChild(child);
    setLoadingCompletions(true);
    try {
      const { data } = await axios.get(`${API}/parent/child-completions/${child.student.id}`);
      setChildCompletions(data);
    } catch (error) {
      setChildCompletions([]);
    } finally {
      setLoadingCompletions(false);
    }
  };

  return (
    <div className="min-h-screen bg-background watermark-main page-border-main">
      <div className="dashboard-gradient border-b dashboard-header-cyan scan-line-effect">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="parent-dashboard-title">
                <Shield className="h-8 w-8 text-primary" />
                Parent Dashboard
              </h1>
              <p className="text-muted-foreground">Monitor your children's learning progress</p>
            </div>
            <div className="flex gap-2">
              <LanguageSelector />
              <Button variant="ghost" onClick={logout} data-testid="parent-logout-button">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Children Linked</p>
                  <p className="text-3xl font-bold">{children.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <p className="text-3xl font-bold">
                    {children.reduce((sum, c) => sum + (c.progress?.activities_completed || 0), 0)}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-3xl font-bold">
                    {children.reduce((sum, c) => sum + (c.progress?.points || 0), 0)}
                  </p>
                </div>
                <Star className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList>
            <TabsTrigger value="children" data-testid="tab-children">
              <Users className="mr-2 h-4 w-4" /> My Children
            </TabsTrigger>
            <TabsTrigger value="add" data-testid="tab-add-child">
              <UserPlus className="mr-2 h-4 w-4" /> Link Child
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            {children.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Children Linked</h3>
                  <p className="text-muted-foreground mb-4">
                    Link your child's student account to start tracking their progress.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Children List */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-lg font-semibold mb-2">Children</h3>
                  {children.map(({ student, progress }) => (
                    <Card 
                      key={student.id} 
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedChild?.student?.id === student.id ? 'border-primary border-2 bg-primary/5' : ''
                      }`}
                      onClick={() => viewChildProgress({ student, progress })}
                      data-testid={`child-card-${student.id}`}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{student.full_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.age_group && <Badge variant="outline" className="mr-1">{student.age_group}</Badge>}
                              {progress?.points || 0} pts
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Child Detail */}
                <div className="lg:col-span-2">
                  {selectedChild ? (
                    <Card className="card-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl">{selectedChild.student.full_name}</CardTitle>
                            <CardDescription>
                              {selectedChild.student.email} • Age Group: {selectedChild.student.age_group || 'N/A'}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => unlinkChild(selectedChild.student.id)}
                            data-testid="unlink-child-button"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Unlink
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Progress Stats */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 rounded-lg bg-primary/5">
                            <BookOpen className="h-6 w-6 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">{selectedChild.progress?.activities_completed || 0}</p>
                            <p className="text-xs text-muted-foreground">Activities</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-primary/5">
                            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">{selectedChild.progress?.points || 0}</p>
                            <p className="text-xs text-muted-foreground">Points</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-primary/5">
                            <Clock className="h-6 w-6 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">{selectedChild.progress?.total_time_spent || 0}m</p>
                            <p className="text-xs text-muted-foreground">Time</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-primary/5">
                            <Award className="h-6 w-6 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">
                              {selectedChild.progress?.badges_earned?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Badges</p>
                          </div>
                        </div>

                        {/* Badges */}
                        {selectedChild.progress?.badges_earned?.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Badges Earned</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedChild.progress.badges_earned.map((badge, idx) => (
                                <Badge key={idx} variant="secondary" className="px-3 py-1">
                                  {badge.icon} {badge.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recent Activity */}
                        <div>
                          <h4 className="font-semibold mb-2">Recent Activity</h4>
                          {loadingCompletions ? (
                            <p className="text-muted-foreground text-sm">Loading...</p>
                          ) : childCompletions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No activities completed yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {childCompletions.map((completion, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{completion.activity_title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {completion.time_spent_minutes}min spent
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">+10 pts</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Select a child to view their progress</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Link a Child Account
                </CardTitle>
                <CardDescription>
                  Enter your child's student email address to link their account and monitor their progress.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={linkChild} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Child's Email</label>
                    <Input
                      type="email"
                      placeholder="child@example.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      data-testid="link-child-email-input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your child must have registered as a Student first.
                    </p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full" data-testid="link-child-button">
                    {loading ? 'Linking...' : (
                      <><UserPlus className="mr-2 h-4 w-4" /> Link Child Account</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
