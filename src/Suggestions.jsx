import React from "react";
import data from "./futureTests.json";
import { Link } from "react-router-dom";

function Suggestions() {
  const futureTests = data.futureTests; // Adjusted to use "futureTests"

  return (
    <div>
      <h2>Upcoming Tests</h2>
      <table>
        <thead>
          <tr>
            <th>Test suggestions</th>
          </tr>
        </thead>
        <tbody>
          {futureTests.map((test, index) => ( // Adjusted to use "futureTests"
            <tr key={index}>
              <td>{test.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Suggestions;
