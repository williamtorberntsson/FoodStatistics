import React from "react";
import data from "./data.json";
/*import "./Suggestions.css";*/
import { Link } from "react-router-dom";

function Suggestions() {
  return (
    <div>
      <h2>Upcomming Tests</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Paprika</td>
          </tr>
          <tr>
            <td>Kolsyrat Vatten</td>
          </tr>
          <tr>
            <td>REDO OLD TESTS!</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Suggestions;