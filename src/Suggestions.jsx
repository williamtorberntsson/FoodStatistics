import React from "react";
import futureTests from "./futureTests.json";

const FutureTests = () => {
  return (
    <div>
      <h2>Future Taste Tests</h2>
      <table>
        <thead>
          <tr>
            <th>Upcoming Tests</th>
          </tr>
        </thead>
        <tbody>
          {futureTests.futureTests.map((test, index) => (
            <tr key={index}>
              <td>
                <strong>{test.name}</strong>
                <ul>
                  {test.itemsToTest.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FutureTests;
