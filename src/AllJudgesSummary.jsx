import React from "react";
import data from "./data.json";

const AllJudgesSummary = () => {
  // Aggregate judge appearances
  const judgeCounts = data.tests.reduce((acc, test) => {
    // If the judge is already accounted for, increment their count
    if (acc[test.judge]) {
      acc[test.judge] += 1;
    } else {
      // Otherwise, initialize their count to 1
      acc[test.judge] = 1;
    }
    return acc;
  }, {});

  // Convert the judgeCounts object into an array for rendering
  const judgesArray = Object.keys(judgeCounts).map((judgeName) => ({
    name: judgeName,
    count: judgeCounts[judgeName],
  }));

  // Optionally, sort judges by their count (descending)
  judgesArray.sort((a, b) => b.count - a.count);

  return (
    <div>
      <h2>Special Thanks To All Judges</h2>
      <table>
        <thead>
          <tr>
            <th>Judge Name</th>
            <th>Tests Judged</th>
          </tr>
        </thead>
        <tbody>
          {judgesArray.map(({ name, count }, index) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllJudgesSummary;
