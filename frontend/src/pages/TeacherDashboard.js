import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LogOut, Plus, Upload, BookOpen, Users, BarChart3, 
  Trash2, Edit, Eye, ArrowLeft, GraduationCap, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [myActivities, setMyActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [activityStats, setActivityStats] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    age_group: '5-8',
    topic: 'algorithms',
    difficulty: 'beginner',
    activity_type: 'physical',
    estimated_time: 15,
    is_premium: false,
    instructions: '',
    learning_objectives: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyActivities();
    fetchAllActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      const { data } = await axios.get(`${API}/teacher/my-activities`);
      setMyActivities(data);
    } catch (error) {
      // Fallback to filtering all activities
      try {
        const { data } = await axios.get(`${API}/activities`);
        const mine = data.filter(a => a.created_by === user.id);
        setMyActivities(mine);
      } catch (err) {
        console.error('Failed to fetch activities');
      }
    }
  };

  const fetchAllActivities = async () => {
    try {
      const { data } = await axios.get(`${API}/activities`);
      setAllActivities(data);
    } catch (error) {
      console.error('Failed to fetch all activities');
    }
  };

  const viewActivityStats = async (activity) => {
    setSelectedActivity(activity);
    setLoadingStats(true);
    try {
      const { data } = await axios.get(`${API}/teacher/activity-stats/${activity.id}`);
      setActivityStats(data);
    } catch (error) {
      setActivityStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const deleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await axios.delete(`${API}/teacher/activities/${activityId}`);
      toast.success('Activity deleted');
      fetchMyActivities();
      setSelectedActivity(null);
      setActivityStats(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete activity');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      age_group: '5-8',
      topic: 'algorithms',
      difficulty: 'beginner',
      activity_type: 'physical',
      estimated_time: 15,
      is_premium: false,
      instructions: '',
      learning_objectives: ''
    });
    setSelectedFile(null);
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const instructions = formData.instructions.split('\n').filter(i => i.trim());
      const objectives = formData.learning_objectives.split('\n').filter(o => o.trim());

      if (editing) {
        await axios.put(`${API}/teacher/activities/${editing}`, {
          ...formData,
          instructions,
          learning_objectives: objectives
        });
        toast.success('Activity updated successfully!');
      } else {
        const { data: activity } = await axios.post(`${API}/activities`, {
          ...formData,
          instructions,
          learning_objectives: objectives
        });

        if (selectedFile) {
          const formDataFile = new FormData();
          formDataFile.append('file', selectedFile);
          await axios.post(`${API}/activities/${activity.id}/upload-image`, formDataFile, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Activity created successfully!');
      }

      resetForm();
      setCreating(false);
      fetchMyActivities();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save activity');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (activity) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      age_group: activity.age_group,
      topic: activity.topic,
      difficulty: activity.difficulty,
      activity_type: activity.activity_type,
      estimated_time: activity.estimated_time,
      is_premium: activity.is_premium || false,
      instructions: activity.instructions?.join('\n') || '',
      learning_objectives: activity.learning_objectives?.join('\n') || ''
    });
    setEditing(activity.id);
    setCreating(true);
  };

  return (
    <div className="min-h-screen bg-background watermark-main page-border-main">
      <div className="dashboard-gradient border-b dashboard-header-cyan scan-line-effect">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="teacher-dashboard-title">
                <GraduationCap className="h-8 w-8 text-primary" />
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">Create and manage learning activities</p>
            </div>
            <div className="flex gap-2">
              <LanguageSelector />
              <Button variant="ghost" onClick={logout} data-testid="teacher-logout-button">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Activities</p>
                  <p className="text-3xl font-bold">{myActivities.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold">{myActivities.filter(a => a.is_published).length}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Platform Activities</p>
                  <p className="text-3xl font-bold">{allActivities.length}</p>
                </div>
                <BarChart3 className="h-10 w-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activities" data-testid="tab-my-activities">
              <BookOpen className="mr-2 h-4 w-4" /> My Activities
            </TabsTrigger>
            <TabsTrigger value="create" data-testid="tab-create-activity">
              <Plus className="mr-2 h-4 w-4" /> Create Activity
            </TabsTrigger>
            <TabsTrigger value="browse" data-testid="tab-browse">
              <Eye className="mr-2 h-4 w-4" /> Browse All
            </TabsTrigger>
          </TabsList>

          {/* My Activities Tab */}
          <TabsContent value="activities">
            {myActivities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Activities Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first unplugged learning activity for students!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-4">
                    {myActivities.map((activity) => (
                      <Card 
                        key={activity.id} 
                        className={`card-shadow cursor-pointer transition-all hover:border-primary ${
                          selectedActivity?.id === activity.id ? 'border-primary border-2' : ''
                        }`}
                        onClick={() => viewActivityStats(activity)}
                        data-testid={`teacher-activity-card-${activity.id}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg line-clamp-1">{activity.title}</CardTitle>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" size="icon" className="h-8 w-8"
                                onClick={(e) => { e.stopPropagation(); startEdit(activity); }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                                onClick={(e) => { e.stopPropagation(); deleteActivity(activity.id); }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{activity.age_group}</Badge>
                            <Badge variant="outline">{activity.topic?.replace('_', ' ')}</Badge>
                            <Badge variant="outline">{activity.difficulty}</Badge>
                            {activity.is_published ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Activity Stats Panel */}
                <div>
                  {selectedActivity ? (
                    <Card className="card-shadow sticky top-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Activity Stats</CardTitle>
                        <CardDescription>{selectedActivity.title}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {loadingStats ? (
                          <p className="text-muted-foreground text-sm">Loading stats...</p>
                        ) : activityStats ? (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center p-3 rounded-lg bg-primary/5">
                                <p className="text-2xl font-bold">{activityStats.total_completions}</p>
                                <p className="text-xs text-muted-foreground">Completions</p>
                              </div>
                              <div className="text-center p-3 rounded-lg bg-primary/5">
                                <p className="text-2xl font-bold">{activityStats.average_time_minutes}m</p>
                                <p className="text-xs text-muted-foreground">Avg Time</p>
                              </div>
                            </div>
                            {activityStats.recent_completions?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Recent Completions</h4>
                                <div className="space-y-1">
                                  {activityStats.recent_completions.slice(0, 5).map((c, idx) => (
                                    <div key={idx} className="text-sm flex items-center gap-2 p-2 rounded bg-muted/50">
                                      <CheckCircle className="h-3 w-3 text-primary" />
                                      <span className="truncate">{c.activity_title}</span>
                                      <span className="text-xs text-muted-foreground ml-auto">{c.time_spent_minutes}m</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground text-sm">No stats available yet.</p>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click an activity to view stats</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Create Activity Tab */}
          <TabsContent value="create">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editing ? 'Edit Activity' : 'Create New Activity'}
                </CardTitle>
                <CardDescription>Design an unplugged learning activity for students</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Activity Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        placeholder="e.g., Binary Search Game"
                        data-testid="activity-title-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Age Group</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.age_group}
                        onChange={(e) => setFormData({...formData, age_group: e.target.value})}
                        data-testid="activity-agegroup-select"
                      >
                        <option value="5-8">Foundation (5-8)</option>
                        <option value="9-12">Development (9-12)</option>
                        <option value="13-16">Mastery (13-16)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      placeholder="Brief description of the activity..."
                      rows={2}
                      data-testid="activity-description-input"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Topic</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        data-testid="activity-topic-select"
                      >
                        <option value="algorithms">Algorithms</option>
                        <option value="ai_ml_concepts">AI/ML Concepts</option>
                        <option value="data_and_logic">Data & Logic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Difficulty</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Time (minutes)</label>
                      <Input
                        type="number"
                        value={formData.estimated_time}
                        onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value) || 15})}
                        min={5}
                        max={120}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Instructions (one per line)</label>
                    <Textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      required
                      placeholder="Step 1: Gather students in a circle&#10;Step 2: Explain the concept&#10;Step 3: Begin the activity"
                      rows={6}
                      data-testid="activity-instructions-input"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Learning Objectives (one per line)</label>
                    <Textarea
                      value={formData.learning_objectives}
                      onChange={(e) => setFormData({...formData, learning_objectives: e.target.value})}
                      required
                      placeholder="Understanding algorithms&#10;Problem-solving skills&#10;Logical thinking"
                      rows={4}
                      data-testid="activity-objectives-input"
                    />
                  </div>

                  {!editing && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">Activity Image (optional)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        data-testid="activity-image-input"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="submit" disabled={uploading} className="flex-1" data-testid="create-activity-submit-button">
                      {uploading ? 'Saving...' : editing ? 'Update Activity' : (
                        <><Plus className="mr-2 h-4 w-4" /> Create Activity</>
                      )}
                    </Button>
                    {editing && (
                      <Button type="button" variant="outline" onClick={() => { resetForm(); }}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Browse All Activities Tab */}
          <TabsContent value="browse">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allActivities.map((activity) => (
                <Card key={activity.id} className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{activity.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{activity.age_group}</Badge>
                      <Badge variant="outline">{activity.difficulty}</Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />{activity.estimated_time}min
                      </Badge>
                      {activity.is_premium && <Badge variant="destructive">Premium</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
