// src/ParticipantGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import data from "./data.json"; // Assuming the path to your data file is correct

const ParticipantGraph = ({ participantName }) => {
  // Extracting and calculating tests data for the specific participant, sorted by correctness
  let participantData = data.tests
    .map((test) => {
      const participant = test.participants.find(
        (p) => p.name === participantName
      );
      if (!participant) return null;
      const correctness =
        (participant.guesses.filter(
          (guess, index) => guess === test.truth[index]
        ).length /
          test.truth.length) *
        100;
      return {
        testName: test.name,
        correctness,
      };
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.correctness - a.correctness);

  const chartData = {
    labels: participantData.map((d) => d.testName),
    datasets: [
      {
        label: "Correctness (%)",
        data: participantData.map((d) => d.correctness),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // This swaps the axes
    scales: {
      x: {
        beginAtZero: true, // Ensure the scale starts from zero
        ticks: {
          callback: function (value) {
            return value + "%"; // Append '%' to tick labels
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Display the legend
        labels: {
          boxWidth: 0, // Hide the color box in the legend
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ParticipantGraph;
