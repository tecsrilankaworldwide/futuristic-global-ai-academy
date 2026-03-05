import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Trophy, Medal, Award, TrendingUp, ArrowLeft, Star, Flame, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Leaderboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyBoard, setWeeklyBoard] = useState([]);
  const [monthlyBoard, setMonthlyBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllLeaderboards();
  }, []);

  const fetchAllLeaderboards = async () => {
    setLoading(true);
    try {
      const [allRes, weeklyRes, monthlyRes] = await Promise.all([
        axios.get(`${API}/leaderboard`),
        axios.get(`${API}/leaderboard/weekly`).catch(() => ({ data: [] })),
        axios.get(`${API}/leaderboard/monthly`).catch(() => ({ data: [] }))
      ]);
      setLeaderboard(allRes.data);
      setWeeklyBoard(weeklyRes.data);
      setMonthlyBoard(monthlyRes.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-7 w-7 text-gray-400" />;
    if (rank === 3) return <Medal className="h-7 w-7 text-amber-700" />;
    return <span className="text-xl font-bold text-muted-foreground w-8 text-center">#{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'border-2 border-yellow-300 bg-yellow-50/50';
    if (rank === 2) return 'border-2 border-gray-300 bg-gray-50/50';
    if (rank === 3) return 'border-2 border-amber-300 bg-amber-50/50';
    return '';
  };

  const getAvatarColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank === 2) return 'bg-gray-100 text-gray-800';
    if (rank === 3) return 'bg-amber-100 text-amber-800';
    return 'bg-primary/10 text-primary';
  };

  const renderBoard = (data) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">
              Start completing activities to appear on the leaderboard!
            </p>
          </CardContent>
        </Card>
      );
    }

    // Top 3 podium
    const top3 = data.slice(0, 3);
    const rest = data.slice(3);

    return (
      <div className="space-y-6">
        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 0, 2].map((idx) => {
              const entry = top3[idx];
              if (!entry) return <div key={idx} />;
              const isFirst = idx === 0;
              return (
                <Card 
                  key={entry.rank} 
                  className={`card-shadow text-center ${isFirst ? 'md:-mt-4' : ''} ${getRankStyle(entry.rank)}`}
                  data-testid={`leaderboard-rank-${entry.rank}`}
                >
                  <CardContent className="pt-6 pb-4">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className={`h-16 w-16 mx-auto mb-2 ${getAvatarColor(entry.rank)}`}>
                      <AvatarFallback className="text-xl font-bold">
                        {entry.student_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg truncate">{entry.student_name}</h3>
                    <p className="text-3xl font-bold text-primary mt-1">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {entry.activities_completed} activities
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {rest.map((entry) => (
            <Card 
              key={entry.rank} 
              className={`transition-all hover:border-primary/30 ${
                user?.full_name === entry.student_name ? 'border-primary bg-primary/5' : ''
              }`}
              data-testid={`leaderboard-entry-${entry.rank}`}
            >
              <CardContent className="py-3">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 text-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="text-sm font-bold">
                      {entry.student_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {entry.student_name}
                      {user?.full_name === entry.student_name && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.activities_completed} activities
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold text-primary">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Find user's rank
  const userRank = user ? leaderboard.find(e => e.student_name === user.full_name) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="leaderboard-page-title">
                <Trophy className="h-8 w-8 text-primary" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground">Top learners in the community</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Your Rank Card */}
        {user && user.role === 'student' && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-lg font-bold">
                      {user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">Your Position</p>
                  </div>
                </div>
                {userRank ? (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">#{userRank.rank}</p>
                    <p className="text-sm text-muted-foreground">{userRank.points} points</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Complete activities to rank!</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" data-testid="leaderboard-tab-all">
              <Star className="mr-2 h-4 w-4" /> All Time
            </TabsTrigger>
            <TabsTrigger value="weekly" data-testid="leaderboard-tab-weekly">
              <Flame className="mr-2 h-4 w-4" /> This Week
            </TabsTrigger>
            <TabsTrigger value="monthly" data-testid="leaderboard-tab-monthly">
              <Calendar className="mr-2 h-4 w-4" /> This Month
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderBoard(leaderboard)}
          </TabsContent>
          <TabsContent value="weekly" className="mt-6">
            {renderBoard(weeklyBoard)}
          </TabsContent>
          <TabsContent value="monthly" className="mt-6">
            {renderBoard(monthlyBoard)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
