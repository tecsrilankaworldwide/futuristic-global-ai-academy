import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Trophy, Medal, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import LanguageSelector from '../components/LanguageSelector';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`${API}/leaderboard`);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-400" />;
    if (rank === 3) return <Medal className="h-8 w-8 text-orange-600" />;
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="dashboard-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
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
        {loading ? (
          <div className="text-center py-12">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No leaderboard data yet. Start completing activities to appear here!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <Card 
                key={entry.rank} 
                className={`card-shadow ${getRankBg(entry.rank)} ${entry.rank <= 3 ? 'border-2' : ''}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 text-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="text-lg font-bold">
                        {entry.student_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{entry.student_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.activities_completed} activities • {entry.badges_count} badges
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <p className="text-3xl font-bold text-primary">{entry.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* User's Rank */}
        {user && user.role === 'student' && leaderboard.length > 0 && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Your Ranking</p>
                {(() => {
                  const userEntry = leaderboard.find(e => e.student_name === user.full_name);
                  return userEntry ? (
                    <div>
                      <p className="text-3xl font-bold text-primary">#{userEntry.rank}</p>
                      <p className="text-sm text-muted-foreground mt-1">{userEntry.points} points</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Complete activities to join the leaderboard!</p>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
