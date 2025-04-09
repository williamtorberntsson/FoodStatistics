import { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, CircularProgress, Paper } from '@mui/material';
import { Bar, Line, Radar } from 'react-chartjs-2';
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
} from 'chart.js';

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
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && children}
    </div>
  );
}

function StatisticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testsIndex, setTestsIndex] = useState(null);
  const [testsData, setTestsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the index file
        const indexResponse = await fetch('/data/food-tests/index.json');
        const indexData = await indexResponse.json();
        setTestsIndex(indexData);

        // Fetch all test files
        const testPromises = indexData.tests.map(test =>
          fetch(`/data/food-tests/${test.fileName}`).then(res => res.json())
        );
        const testsResults = await Promise.all(testPromises);
        setTestsData(testsResults);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTestAccuracy = (test) => {
    let totalCorrect = 0;
    let totalGuesses = 0;

    test.participants.forEach(participant => {
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
    
    testsData.forEach(test => {
      test.participants.forEach(participant => {
        if (!stats[participant.name]) {
          stats[participant.name] = {
            totalCorrect: 0,
            totalGuesses: 0,
            testResults: []
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
          accuracy: (correct / participant.guesses.length) * 100
        });
      });
    });

    return stats;
  };

  const overallAccuracyData = {
    labels: testsData.map(test => test.name),
    datasets: [{
      label: 'Accuracy (%)',
      data: testsData.map(test => calculateTestAccuracy(test)),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const participantPerformanceData = {
    labels: testsData.map(test => test.name),
    datasets: Object.entries(testsData.length ? calculateParticipantStats() : {}).map(([name, stats], index) => ({
      label: name,
      data: stats.testResults.map(result => result.accuracy),
      borderColor: `hsl(${index * 45}, 70%, 50%)`,
      tension: 0.3,
      fill: false
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Test Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Accuracy (%)',
        },
      },
    },
  };

  if (loading) {
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Food Tasting Statistics
        </Typography>
        
        <Paper sx={{ mt: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab label="Overall Accuracy" />
            <Tab label="Participant Performance" />
            <Tab label="Test Details" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Bar data={overallAccuracyData} options={options} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Line 
              data={participantPerformanceData}
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    ...options.plugins.title,
                    text: 'Participant Performance Across Tests'
                  }
                }
              }}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {testsData.map((test, index) => (
              <Box key={test.name} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {test.name} - {test.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {test.date} | Judge: {test.judge} | Buyer: {test.buyer}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Radar
                    data={{
                      labels: test.participants.map(p => p.name),
                      datasets: [{
                        label: 'Accuracy (%)',
                        data: test.participants.map(participant => {
                          const correct = participant.guesses.filter(
                            (guess, idx) => guess === test.truth[idx]
                          ).length;
                          return (correct / participant.guesses.length) * 100;
                        }),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                      }]
                    }}
                    options={{
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            ))}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}

export default StatisticsPage; 