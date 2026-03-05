import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { LogOut, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [creating, setCreating] = useState(false);
  const [myActivities, setMyActivities] = useState([]);
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

  useEffect(() => {
    fetchMyActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      const { data } = await axios.get(`${API}/activities`);
      // Filter activities created by this teacher
      const mine = data.filter(a => a.created_by === user.id);
      setMyActivities(mine);
    } catch (error) {
      console.error('Failed to fetch activities');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const instructions = formData.instructions.split('\n').filter(i => i.trim());
      const objectives = formData.learning_objectives.split('\n').filter(o => o.trim());

      const { data: activity } = await axios.post(`${API}/activities`, {
        ...formData,
        instructions,
        learning_objectives: objectives
      });

      // Upload image if selected
      if (selectedFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', selectedFile);
        await axios.post(`${API}/activities/${activity.id}/upload-image`, formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success('Activity created successfully! Pending admin approval.');
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
      setCreating(false);
      fetchMyActivities();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create activity');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Teacher Dashboard 🎓</h1>
              <p className="text-muted-foreground">Create and manage learning activities</p>
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
        <Button 
          onClick={() => setCreating(!creating)} 
          className="mb-6"
          data-testid="create-activity-toggle-button"
        >
          <Plus className="mr-2 h-4 w-4" /> {creating ? 'Cancel' : 'Create New Activity'}
        </Button>

        {creating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Activity</CardTitle>
              <CardDescription>Design an unplugged learning activity for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Activity Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      placeholder="e.g., Binary Search Game"
                      data-testid="activity-title-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Age Group</label>
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
                  <label className="text-sm font-medium">Description</label>
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
                    <label className="text-sm font-medium">Topic</label>
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
                    <label className="text-sm font-medium">Difficulty</label>
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
                    <label className="text-sm font-medium">Time (minutes)</label>
                    <Input
                      type="number"
                      value={formData.estimated_time}
                      onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})}
                      min={5}
                      max={120}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Instructions (one per line)</label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    required
                    placeholder="Step 1: ...\nStep 2: ...\nStep 3: ..."
                    rows={6}
                    data-testid="activity-instructions-input"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Learning Objectives (one per line)</label>
                  <Textarea
                    value={formData.learning_objectives}
                    onChange={(e) => setFormData({...formData, learning_objectives: e.target.value})}
                    required
                    placeholder="Understanding algorithms\nProblem-solving skills\nLogical thinking"
                    rows={4}
                    data-testid="activity-objectives-input"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Activity Image (optional)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    data-testid="activity-image-input"
                  />
                </div>

                <Button type="submit" disabled={uploading} className="w-full" data-testid="create-activity-submit-button">
                  {uploading ? 'Creating...' : <><Plus className="mr-2 h-4 w-4" /> Create Activity</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* My Activities */}
        <h2 className="text-2xl font-bold mb-4">My Created Activities</h2>
        {myActivities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven't created any activities yet. Click 'Create New Activity' to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myActivities.map((activity) => (
              <Card key={activity.id} className="card-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{activity.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{activity.age_group}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{activity.topic.replace('_', ' ')}</span>
                    {activity.is_published ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ Published</span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending Review</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
