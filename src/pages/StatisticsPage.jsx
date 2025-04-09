import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { Bar, Line, Radar } from "react-chartjs-2";
import { getAssetPath } from "../utils/paths";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: "20px 0" }}>
      {value === index && children}
    </div>
  );
}

function StatisticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testsIndex, setTestsIndex] = useState(null);
  const [testsData, setTestsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the index file
        const indexResponse = await fetch(
          getAssetPath("/data/food-tests/index.json")
        );
        const indexData = await indexResponse.json();
        setTestsIndex(indexData);

        // Fetch all test files
        const testPromises = indexData.tests.map((test) =>
          fetch(getAssetPath(`/data/food-tests/${test.fileName}`)).then((res) =>
            res.json()
          )
        );
        const testsResults = await Promise.all(testPromises);
        setTestsData(testsResults);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTestAccuracy = (test) => {
    let totalCorrect = 0;
    let totalGuesses = 0;

    test.participants.forEach((participant) => {
      participant.guesses.forEach((guess, index) => {
        if (guess === test.truth[index]) {
          totalCorrect++;
        }
        totalGuesses++;
      });
    });

    return (totalCorrect / totalGuesses) * 100;
  };

  const calculateParticipantStats = () => {
    const stats = {};

    testsData.forEach((test) => {
      test.participants.forEach((participant) => {
        if (!stats[participant.name]) {
          stats[participant.name] = {
            totalCorrect: 0,
            totalGuesses: 0,
            testResults: [],
          };
        }

        let correct = 0;
        participant.guesses.forEach((guess, index) => {
          if (guess === test.truth[index]) correct++;
        });

        stats[participant.name].totalCorrect += correct;
        stats[participant.name].totalGuesses += participant.guesses.length;
        stats[participant.name].testResults.push({
          test: test.name,
          accuracy: (correct / participant.guesses.length) * 100,
        });
      });
    });

    // Calculate average accuracy for each participant
    Object.keys(stats).forEach((name) => {
      stats[name].averageAccuracy =
        (stats[name].totalCorrect / stats[name].totalGuesses) * 100;
    });

    return stats;
  };

  const calculateWeightedParticipantStats = () => {
    const stats = {};
    const testDifficulties = {};
    const RANDOM_CHANCE = 33.33; // Random guessing probability with 3 options

    // First, calculate the adjusted average accuracy for each test
    testsData.forEach((test) => {
      let totalCorrect = 0;
      let totalGuesses = 0;
      test.participants.forEach((participant) => {
        participant.guesses.forEach((guess, index) => {
          if (guess === test.truth[index]) totalCorrect++;
          totalGuesses++;
        });
      });
      const rawAccuracy = (totalCorrect / totalGuesses) * 100;

      // Calculate normalized accuracy: how much better than random guessing
      // This will be negative if worse than random, 0 if equal to random, positive if better
      const normalizedAccuracy =
        ((rawAccuracy - RANDOM_CHANCE) / (100 - RANDOM_CHANCE)) * 100;

      // Weight calculation: harder tests (closer to random chance) get higher weights
      testDifficulties[test.name] = {
        rawAccuracy,
        normalizedAccuracy,
        // Weight is higher when normalized accuracy is closer to 0 (random chance)
        weight: 1 + Math.exp(-Math.abs(normalizedAccuracy) / 20),
      };
    });

    // Calculate weighted scores for each participant
    testsData.forEach((test) => {
      test.participants.forEach((participant) => {
        if (!stats[participant.name]) {
          stats[participant.name] = {
            weightedScore: 0,
            totalWeight: 0,
            testResults: [],
            totalTests: 0,
          };
        }

        let correct = 0;
        participant.guesses.forEach((guess, index) => {
          if (guess === test.truth[index]) correct++;
        });

        const rawAccuracy = (correct / participant.guesses.length) * 100;
        const normalizedAccuracy =
          ((rawAccuracy - RANDOM_CHANCE) / (100 - RANDOM_CHANCE)) * 100;
        const { weight } = testDifficulties[test.name];

        stats[participant.name].testResults.push({
          test: test.name,
          rawAccuracy,
          normalizedAccuracy,
          weight,
          weightedScore: normalizedAccuracy * weight,
          testDifficulty: testDifficulties[test.name].normalizedAccuracy,
        });

        stats[participant.name].weightedScore += normalizedAccuracy * weight;
        stats[participant.name].totalWeight += weight;
        stats[participant.name].totalTests++;
      });
    });

    // Calculate final weighted average for each participant
    Object.keys(stats).forEach((name) => {
      const participant = stats[name];
      participant.weightedAverage =
        participant.weightedScore / participant.totalWeight;

      // Calculate additional statistics
      participant.bestPerformance = Math.max(
        ...participant.testResults.map((r) => r.normalizedAccuracy)
      );
      participant.worstPerformance = Math.min(
        ...participant.testResults.map((r) => r.normalizedAccuracy)
      );
      participant.consistencyScore =
        100 - (participant.bestPerformance - participant.worstPerformance);
    });

    return stats;
  };

  const overallAccuracyData = {
    labels: testsData
      .map((test) => ({
        name: test.name,
        accuracy: calculateTestAccuracy(test),
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .map((test) => test.name),
    datasets: [
      {
        label: "Accuracy (%)",
        data: testsData
          .map((test) => ({
            name: test.name,
            accuracy: calculateTestAccuracy(test),
          }))
          .sort((a, b) => b.accuracy - a.accuracy)
          .map((test) => test.accuracy),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const participantPerformanceData = {
    labels: Object.entries(testsData.length ? calculateParticipantStats() : {})
      .map(([name, stats]) => ({
        name,
        accuracy: stats.averageAccuracy,
        testsParticipated: stats.testResults.length,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .map(
        (participant) =>
          `${participant.name} (${participant.testsParticipated} tests)`
      ),
    datasets: [
      {
        label: "Average Accuracy (%)",
        data: Object.entries(
          testsData.length ? calculateParticipantStats() : {}
        )
          .map(([name, stats]) => ({
            name,
            accuracy: stats.averageAccuracy,
          }))
          .sort((a, b) => b.accuracy - a.accuracy)
          .map((participant) => participant.accuracy),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const weightedPerformanceData = {
    labels: Object.entries(
      testsData.length ? calculateWeightedParticipantStats() : {}
    )
      .map(([name, stats]) => ({
        name,
        score: stats.weightedAverage,
        testsParticipated: stats.totalTests,
      }))
      .sort((a, b) => b.score - a.score)
      .map(
        (participant) =>
          `${participant.name} (${participant.testsParticipated} tests)`
      ),
    datasets: [
      {
        label: "Performance vs Random Chance",
        data: Object.entries(
          testsData.length ? calculateWeightedParticipantStats() : {}
        )
          .map(([name, stats]) => ({
            name,
            score: stats.weightedAverage,
          }))
          .sort((a, b) => b.score - a.score)
          .map((participant) => participant.score),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Test Results",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Accuracy: ${context.parsed.x.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          font: {
            size: 11,
          },
        },
      },
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Accuracy (%)",
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
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
            Food Tasting Statistics
          </Typography>
        </Box>

        <Paper sx={{ mt: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.3,
              },
              "& .MuiTab-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: { xs: "auto", sm: 160 },
                px: { xs: 1, sm: 2 },
              },
            }}
          >
            <Tab
              label="Overall Accuracy"
              sx={{
                textTransform: "none",
                flexShrink: 0,
              }}
            />
            <Tab
              label="Average Performance"
              sx={{
                textTransform: "none",
                flexShrink: 0,
              }}
            />
            <Tab
              label="Weighted Performance"
              sx={{
                textTransform: "none",
                flexShrink: 0,
              }}
            />
            <Tab
              label="Test Details"
              sx={{
                textTransform: "none",
                flexShrink: 0,
              }}
            />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ height: { xs: "400px", sm: "500px" } }}>
              <Bar data={overallAccuracyData} options={options} />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ height: { xs: "400px", sm: "500px" } }}>
              <Bar
                data={participantPerformanceData}
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    title: {
                      ...options.plugins.title,
                      text: "Average Performance Per Participant",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Average Accuracy: ${context.parsed.x.toFixed(
                            1
                          )}%`;
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ height: { xs: "400px", sm: "500px" } }}>
              <Bar
                data={weightedPerformanceData}
                options={{
                  ...options,
                  scales: {
                    ...options.scales,
                    x: {
                      ...options.scales.x,
                      max: 100,
                      min: -50, // Allow showing performance worse than random
                      title: {
                        display: true,
                        text: "Performance vs Random Chance (%)",
                      },
                    },
                  },
                  plugins: {
                    ...options.plugins,
                    title: {
                      ...options.plugins.title,
                      text: "Performance Relative to Random Guessing",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const stats = calculateWeightedParticipantStats();
                          const participantName = context.label.split(" (")[0];
                          const participantStats = stats[participantName];
                          return [
                            `Overall Score: ${context.parsed.x.toFixed(1)}% ${
                              context.parsed.x > 0
                                ? "better than"
                                : "worse than"
                            } random`,
                            `Tests Participated: ${participantStats.totalTests}`,
                            `Best Performance: ${participantStats.bestPerformance.toFixed(
                              1
                            )}% better than random`,
                            `Worst Performance: ${participantStats.worstPerformance.toFixed(
                              1
                            )}% better than random`,
                            `Consistency Score: ${participantStats.consistencyScore.toFixed(
                              1
                            )}%`,
                          ];
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {testsData.map((test, index) => (
              <Paper key={test.name} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {test.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {test.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 3,
                      mt: 2,
                      color: "text.secondary",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Date
                      </Typography>
                      <Typography variant="body2">{test.date}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Judge
                      </Typography>
                      <Typography variant="body2">{test.judge}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Buyer
                      </Typography>
                      <Typography variant="body2">{test.buyer}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Alternatives
                      </Typography>
                      <Typography variant="body2">
                        {test.alternatives.join(", ")}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Overall Accuracy
                      </Typography>
                      <Typography variant="body2">
                        {calculateTestAccuracy(test).toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Participants
                      </Typography>
                      <Typography variant="body2">
                        {test.participants.length}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 300 }}>
                      <Radar
                        data={{
                          labels: test.participants.map((p) => p.name),
                          datasets: [
                            {
                              label: "Accuracy (%)",
                              data: test.participants.map((participant) => {
                                const correct = participant.guesses.filter(
                                  (guess, idx) => guess === test.truth[idx]
                                ).length;
                                return (
                                  (correct / participant.guesses.length) * 100
                                );
                              }),
                              backgroundColor: "rgba(75, 192, 192, 0.2)",
                              borderColor: "rgba(75, 192, 192, 1)",
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                stepSize: 20,
                              },
                            },
                          },
                          plugins: {
                            title: {
                              display: true,
                              text: "Participant Accuracy",
                            },
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Individual Results
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: 300,
                        overflowY: "auto",
                      }}
                    >
                      {test.participants
                        .map((participant) => ({
                          ...participant,
                          accuracy:
                            (participant.guesses.filter(
                              (guess, idx) => guess === test.truth[idx]
                            ).length /
                              participant.guesses.length) *
                            100,
                        }))
                        .sort((a, b) => b.accuracy - a.accuracy)
                        .map((participant, idx) => (
                          <Box
                            key={participant.name}
                            sx={{
                              p: 2,
                              bgcolor: "grey.50",
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography>
                              {idx + 1}. {participant.name}
                            </Typography>
                            <Typography fontWeight="bold">
                              {participant.accuracy.toFixed(1)}%
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}

export default StatisticsPage;
