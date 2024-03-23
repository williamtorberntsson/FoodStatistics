import React, { useState } from "react";
import tasteData from "./tasteData.json";
import "./App.css";


const CategoryDetails = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const calculateAverageScore = (itemIndex, participants) => {
    const totalScore = participants.reduce(
      (acc, participant) => acc + participant.ratings[itemIndex],
      0
    );
    return totalScore / participants.length;
  };

  return (
    <div>
      <h2>Test Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {tasteData.tests.map((test, testIndex) => (
            <React.Fragment key={testIndex}>
              <tr onClick={() => toggleCategory(test.category)}>
                <td>{test.category}</td>
                <td>Click to expand</td>
              </tr>
              {expandedCategory === test.category &&
                test.items.map((item, itemIndex) => (
                  <tr key={item}>
                    <td>-- {item}</td>
                    <td>
                      {calculateAverageScore(
                        itemIndex,
                        test.participants
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryDetails;
