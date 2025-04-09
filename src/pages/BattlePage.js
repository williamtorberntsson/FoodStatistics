import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress
} from '@mui/material';

function BattlePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, battlesResponse] = await Promise.all([
          fetch('/data/battle-stats/config.json'),
          fetch('/data/battle-stats/battles-index.json')
        ]);
        
        const configData = await configResponse.json();
        const battlesData = await battlesResponse.json();
        
        setConfig(configData);
        setBattles(battlesData.battles);
        setLoading(false);
      } catch (err) {
        setError('Failed to load battle data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !config) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography color="error" align="center">{error}</Typography>
        </Box>
      </Container>
    );
  }

  const calculateTeamStats = () => {
    const stats = {};
    
    // Initialize stats for each team
    Object.entries(config.teams).forEach(([teamId, team]) => {
      stats[teamId] = {
        ...team,
        id: teamId,
        wins: 0,
        losses: 0,
        totalScore: 0,
        totalAgainst: 0
      };
    });

    // Calculate stats from battles
    battles.forEach(battle => {
      const teams = Object.entries(battle.teams);
      const [[team1Id, team1Score], [team2Id, team2Score]] = teams;
      const winner = team1Score > team2Score ? team1Id : team2Id;

      // Update team 1 stats
      stats[team1Id].totalScore += team1Score;
      stats[team1Id].totalAgainst += team2Score;
      if (winner === team1Id) {
        stats[team1Id].wins += 1;
      } else {
        stats[team1Id].losses += 1;
      }

      // Update team 2 stats
      stats[team2Id].totalScore += team2Score;
      stats[team2Id].totalAgainst += team1Score;
      if (winner === team2Id) {
        stats[team2Id].wins += 1;
      } else {
        stats[team2Id].losses += 1;
      }
    });

    return Object.values(stats);
  };

  const teamStats = calculateTeamStats();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Team Battles
        </Typography>

        {/* Battle Overview */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Battle Overview
          </Typography>
          <Grid container spacing={3}>
            {teamStats.map(team => (
              <Grid item xs={12} md={6} key={team.id}>
                <Card sx={{ bgcolor: team.color, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {team.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Wins: {team.wins}</Typography>
                      <Typography>Losses: {team.losses}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Points For: {team.totalScore}</Typography>
                      <Typography>Points Against: {team.totalAgainst}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(team.wins / (team.wins + team.losses || 1)) * 100}
                      sx={{ 
                        height: 10, 
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Battle History */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Battle History
          </Typography>
          {battles.map(battle => {
            const teams = Object.entries(battle.teams);
            const [[team1Id, team1Score], [team2Id, team2Score]] = teams;

            return (
              <Card key={battle.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {config.battleTypes[battle.type].name} {config.battleTypes[battle.type].icon}
                    </Typography>
                    <Typography color="text.secondary">
                      {battle.date}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    my: 2
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        flex: 1, 
                        textAlign: 'right',
                        color: config.teams[team1Id].color
                      }}
                    >
                      {config.teams[team1Id].name}
                    </Typography>
                    <Box sx={{ 
                      mx: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'grey.100',
                      px: 3,
                      py: 1,
                      borderRadius: 2
                    }}>
                      <Typography variant="h3" sx={{ mx: 1 }}>
                        {team1Score}
                      </Typography>
                      <Typography variant="h4" sx={{ mx: 1, color: 'text.secondary' }}>:</Typography>
                      <Typography variant="h3" sx={{ mx: 1 }}>
                        {team2Score}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        flex: 1,
                        color: config.teams[team2Id].color
                      }}
                    >
                      {config.teams[team2Id].name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Paper>
      </Box>
    </Container>
  );
}

export default BattlePage; 