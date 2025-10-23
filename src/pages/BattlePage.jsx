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
  LinearProgress,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getAssetPath } from "../utils/paths";
import { useNavigate } from "react-router-dom";

// Component for individual battle within a category
function BattleCard({ battle, teams }) {
  const teamEntries = Object.entries(battle.teams);
  const [[team1Id, team1Data], [team2Id, team2Data]] = teamEntries;
  const isTie = team1Data.score === team2Data.score;
  const winner = isTie
    ? null
    : team1Data.score > team2Data.score
    ? team1Id
    : team2Id;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {battle.date}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              flex: { xs: "unset", sm: 1 },
              textAlign: { xs: "center", sm: "right" },
              color: teams[team1Id].color,
              fontWeight: winner === team1Id || isTie ? "bold" : "normal",
              opacity: winner === team1Id || isTie ? 1 : 0.7,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {teams[team1Id].name}
          </Typography>
          <Box
            sx={{
              mx: { xs: 0, sm: 2 },
              display: "flex",
              alignItems: "center",
              bgcolor: "grey.100",
              px: { xs: 2, sm: 3 },
              py: 0.5,
              borderRadius: 2,
              width: { xs: "100%", sm: "auto" },
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mx: 1,
                fontSize: { xs: "1.25rem", sm: "1.75rem" },
              }}
            >
              {team1Data.score}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mx: 1,
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.5rem" },
              }}
            >
              :
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mx: 1,
                fontSize: { xs: "1.25rem", sm: "1.75rem" },
              }}
            >
              {team2Data.score}
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              flex: { xs: "unset", sm: 1 },
              textAlign: "center",
              color: teams[team2Id].color,
              fontWeight: winner === team2Id || isTie ? "bold" : "normal",
              opacity: winner === team2Id || isTie ? 1 : 0.7,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {teams[team2Id].name}
          </Typography>
        </Box>
        {team1Data.participants &&
          team1Data.participants.length > 0 &&
          team2Data.participants &&
          team2Data.participants.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[
                  [team1Id, team1Data],
                  [team2Id, team2Data],
                ].map(([teamId, teamData]) => (
                  <Grid item xs={12} md={6} key={teamId}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: teams[teamId].color,
                        mb: 1,
                        fontWeight: "bold",
                      }}
                    >
                      {teams[teamId].name} Players
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
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
                            px: 1.5,
                            py: 0.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              mr: 0.5,
                              bgcolor: teams[teamId].color,
                              fontSize: "0.75rem",
                            }}
                          >
                            {player.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                            {player}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
      </CardContent>
    </Card>
  );
}

// Component for category card showing winner and battles
function CategoryCard({ categoryId, category, categoryStats, teams }) {
  const [expanded, setExpanded] = useState(false);
  const stats = categoryStats[categoryId];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1 }}>
            {category.icon} {category.name}
          </Typography>
          {stats.winner && (
            <EmojiEventsIcon
              sx={{
                color: teams[stats.winner].color,
                fontSize: 28,
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {stats.winner ? (
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: teams[stats.winner].color,
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Winner: {teams[stats.winner].name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.teamWins[stats.winner]} -{" "}
              {stats.teamWins[stats.loser]} wins
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              🤝 Tied
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Object.entries(stats.teamWins)
                .map(([teamId, wins]) => `${teams[teamId].name}: ${wins}`)
                .join(" - ")}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Total Battles: {category.battles.length}
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
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {expanded ? "Hide" : "View"} Details
            </Typography>
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Box>
            {category.battles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} teams={teams} />
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function BattlePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          getAssetPath("/data/battle-stats/battles-index.json")
        );
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load battle data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
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

  // Calculate category statistics and overall scores
  const calculateCategoryStats = () => {
    const categoryStats = {};
    const overallScores = {};

    // Initialize overall scores
    Object.keys(data.teams).forEach((teamId) => {
      overallScores[teamId] = 0;
    });

    // Calculate wins per category
    Object.entries(data.categories).forEach(([categoryId, category]) => {
      const teamWins = {};

      // Initialize team wins for this category
      Object.keys(data.teams).forEach((teamId) => {
        teamWins[teamId] = 0;
      });

      // Count wins in each battle
      category.battles.forEach((battle) => {
        const teamEntries = Object.entries(battle.teams);
        const [[team1Id, team1Data], [team2Id, team2Data]] = teamEntries;
        const isTie = team1Data.score === team2Data.score;

        if (!isTie) {
          const winner =
            team1Data.score > team2Data.score ? team1Id : team2Id;
          teamWins[winner] += 1;
        }
      });

      // Determine category winner
      const teamIds = Object.keys(data.teams);
      const team1Id = teamIds[0];
      const team2Id = teamIds[1];
      const team1Wins = teamWins[team1Id];
      const team2Wins = teamWins[team2Id];

      let categoryWinner = null;
      let categoryLoser = null;

      if (team1Wins > team2Wins) {
        categoryWinner = team1Id;
        categoryLoser = team2Id;
        overallScores[team1Id] += 1;
      } else if (team2Wins > team1Wins) {
        categoryWinner = team2Id;
        categoryLoser = team1Id;
        overallScores[team2Id] += 1;
      }
      // If tied, no one gets a point

      categoryStats[categoryId] = {
        teamWins,
        winner: categoryWinner,
        loser: categoryLoser,
      };
    });

    return { categoryStats, overallScores };
  };

  const { categoryStats, overallScores } = calculateCategoryStats();
  const teamIds = Object.keys(data.teams);
  const team1Id = teamIds[0];
  const team2Id = teamIds[1];
  const totalCategories = Object.keys(data.categories).length;
  const team1Score = overallScores[team1Id];
  const team2Score = overallScores[team2Id];
  const maxScore = Math.max(team1Score, team2Score);
  const team1Percentage = totalCategories
    ? (team1Score / totalCategories) * 100
    : 0;
  const team2Percentage = totalCategories
    ? (team2Score / totalCategories) * 100
    : 0;

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

        {/* Tier 1: Overall Category Scoreboard */}
        <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Category Standings
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 2, sm: 3 },
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "right" } }}>
              <Typography
                variant="h4"
                sx={{
                  color: data.teams[team1Id].color,
                  fontWeight: "bold",
                  fontSize: { xs: "1.25rem", sm: "2rem" },
                }}
              >
                {data.teams[team1Id].name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "grey.100",
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                minWidth: { xs: "200px", sm: "250px" },
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: data.teams[team1Id].color,
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                {team1Score}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mx: { xs: 1.5, sm: 2 },
                  color: "text.secondary",
                  fontSize: { xs: "1.5rem", sm: "2.5rem" },
                }}
              >
                -
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: data.teams[team2Id].color,
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                {team2Score}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant="h4"
                sx={{
                  color: data.teams[team2Id].color,
                  fontWeight: "bold",
                  fontSize: { xs: "1.25rem", sm: "2rem" },
                }}
              >
                {data.teams[team2Id].name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  minWidth: { xs: "40px", sm: "50px" },
                  textAlign: "right",
                  mr: 1,
                  fontWeight: "bold",
                  color: data.teams[team1Id].color,
                }}
              >
                {Math.round(team1Percentage)}%
              </Typography>
              <Box sx={{ flex: 1, position: "relative" }}>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 20,
                    borderRadius: 2,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "grey.200",
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${team1Percentage}%`,
                    bgcolor: data.teams[team1Id].color,
                    borderRadius: 2,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: `${team2Percentage}%`,
                    bgcolor: data.teams[team2Id].color,
                    borderRadius: 2,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  minWidth: { xs: "40px", sm: "50px" },
                  textAlign: "left",
                  ml: 1,
                  fontWeight: "bold",
                  color: data.teams[team2Id].color,
                }}
              >
                {Math.round(team2Percentage)}%
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Total Categories: {totalCategories}
          </Typography>
        </Paper>

        {/* Tier 2: Category Breakdown Cards */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
          >
            Category Breakdown
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(data.categories).map(([categoryId, category]) => (
              <Grid item xs={12} md={6} key={categoryId}>
                <CategoryCard
                  categoryId={categoryId}
                  category={category}
                  categoryStats={categoryStats}
                  teams={data.teams}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default BattlePage;
