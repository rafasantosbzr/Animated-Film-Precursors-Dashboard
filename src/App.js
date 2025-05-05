import React, { useEffect, useState } from "react";
import awardsData from "./data/animated_features_awards.json";
import AwardTable from "./components/AwardTable";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(awardsData);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Awards Dashboard</h1>
      <div className="table-sticky-wrapper">
        <AwardTable data={data} />
      </div>
    </div>
  );
}

export default App;