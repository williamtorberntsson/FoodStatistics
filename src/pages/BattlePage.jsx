import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  Divider,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAssetPath } from "../utils/paths";
import { useNavigate } from "react-router-dom";

function BattleCard({ battle, config }) {
  const [expanded, setExpanded] = useState(false);
  const teams = Object.entries(battle.teams);
  const [[team1Id, team1Data], [team2Id, team2Data]] = teams;
  const isTie = team1Data.score === team2Data.score;
  const winner = isTie ? null : (team1Data.score > team2Data.score ? team1Id : team2Id);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {config.battleTypes[battle.type].name}{" "}
            {config.battleTypes[battle.type].icon}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              mr: 1,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {battle.date}
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{
              transform: expanded ? "rotate(-180deg)" : "rotate(0)",
              transition: "transform 0.3s",
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            my: { xs: 1, sm: 2 },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              flex: { xs: "unset", sm: 1 },
              textAlign: { xs: "center", sm: "right" },
              color: config.teams[team1Id].color,
              fontWeight: (winner === team1Id || isTie) ? "bold" : "normal",
              opacity: (winner === team1Id || isTie) ? 1 : 0.7,
              fontSize: { xs: "1.25rem", sm: "2rem" },
            }}
          >
            {config.teams[team1Id].name}
          </Typography>
          <Box
            sx={{
              mx: { xs: 0, sm: 2 },
              display: "flex",
              alignItems: "center",
              bgcolor: "grey.100",
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: 2,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                mx: 1,
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
              }}
            >
              {team1Data.score}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mx: 1,
                color: "text.secondary",
                fontSize: { xs: "1.25rem", sm: "2rem" },
              }}
            >
              :
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mx: 1,
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
              }}
            >
              {team2Data.score}
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              flex: { xs: "unset", sm: 1 },
              textAlign: "center",
              color: config.teams[team2Id].color,
              fontWeight: (winner === team2Id || isTie) ? "bold" : "normal",
              opacity: (winner === team2Id || isTie) ? 1 : 0.7,
              fontSize: { xs: "1.25rem", sm: "2rem" },
            }}
          >
            {config.teams[team2Id].name}
          </Typography>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: { xs: 1, sm: 2 } }} />
          <Grid container spacing={2}>
            {[
              [team1Id, team1Data],
              [team2Id, team2Data],
            ].map(([teamId, teamData]) => (
              <Grid item xs={12} md={6} key={teamId}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: config.teams[teamId].color,
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {config.teams[teamId].name} Players
                  </Typography>
                  {teamData.participants && teamData.participants.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: { xs: "center", sm: "flex-start" },
                      }}
                    >
                      {teamData.participants.map((player, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "grey.100",
                            borderRadius: 2,
                            px: { xs: 1.5, sm: 2 },
                            py: 0.75,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 20, sm: 24 },
                              height: { xs: 20, sm: 24 },
                              mr: 1,
                              bgcolor: config.teams[teamId].color,
                              fontSize: { xs: "0.75rem", sm: "1rem" },
                            }}
                          >
                            {player.charAt(0)}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            {player}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      No player information available
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function BattlePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, battlesResponse] = await Promise.all([
          fetch(getAssetPath("/data/battle-stats/config.json")),
          fetch(getAssetPath("/data/battle-stats/battles-index.json")),
        ]);

        const configData = await configResponse.json();
        const battlesData = await battlesResponse.json();

        setConfig(configData);
        setBattles(battlesData.battles);
        setLoading(false);
      } catch (err) {
        setError("Failed to load battle data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !config) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  const calculateTeamStats = () => {
    const stats = {};

    Object.entries(config.teams).forEach(([teamId, team]) => {
      stats[teamId] = {
        ...team,
        id: teamId,
        wins: 0,
        losses: 0,
      };
    });

    battles.forEach((battle) => {
      const teams = Object.entries(battle.teams);
      const [[team1Id, team1Data], [team2Id, team2Data]] = teams;
      const isTie = team1Data.score === team2Data.score;
      const winner = isTie ? null : (team1Data.score > team2Data.score ? team1Id : team2Id);

      if (isTie) {
        // Ties don't count as wins or losses
        return;
      } else if (winner === team1Id) {
        stats[team1Id].wins += 1;
        stats[team2Id].losses += 1;
      } else {
        stats[team2Id].wins += 1;
        stats[team1Id].losses += 1;
      }
    });

    return Object.values(stats);
  };

  const teamStats = calculateTeamStats();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
            aria-label="back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
            Team Battles
          </Typography>
        </Box>

        {/* Battle Overview */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Battle Overview
          </Typography>
          <Grid container spacing={3}>
            {teamStats.map((team) => {
              const totalGames = team.wins + team.losses;
              const winPercentage = totalGames
                ? (team.wins / totalGames) * 100
                : 0;

              return (
                <Grid item xs={12} md={6} key={team.id}>
                  <Card>
                    <CardContent
                      sx={{
                        textAlign: "center",
                        position: "relative",
                        minHeight: "250px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: team.color,
                        color: "white",
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {team.name}
                      </Typography>

                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          my: 2,
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={160}
                          thickness={4}
                          sx={{
                            color: "rgba(255,255,255,0.3)",
                            position: "absolute",
                          }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={winPercentage}
                          size={160}
                          thickness={4}
                          sx={{
                            color: "white",
                            circle: {
                              strokeLinecap: "round",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="h4" component="div">
                            {Math.round(winPercentage)}%
                          </Typography>
                          <Typography variant="caption">Win Rate</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">
                          {team.wins}W - {team.losses}L
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Total Games: {totalGames}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Battle History */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Battle History
          </Typography>
          {battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} config={config} />
          ))}
        </Paper>
      </Box>
    </Container>
  );
}

export default BattlePage;
