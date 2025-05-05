import React from "react";
import "../App.css";

// Define color classes: Pink for 1st most frequent (>=2 mentions), Green for 2nd
const repeatColors = {
  first: "highlight-repeat-1", // Pink
  second: "highlight-repeat-3", // Green
};

function extractOscarWinnerName(value) {
  // Check if value exists and is a string before using includes
  if (!value || typeof value !== "string") return "";
  return value.includes(" / ") ? value.split(" / ")[0].trim() : value.trim();
}

function getMovieFrequencyMap(row) {
  const counts = {};

  // Count frequency of each movie in the row
  Object.entries(row).forEach(([key, value]) => {
    // Ignore Year and empty/placeholder values
    if (key !== "Year" && typeof value === "string" && value !== "-") {
      const parts = value.split(" / ");
      parts.forEach((part) => {
        const trimmedPart = part.trim();
        if (trimmedPart) {
          counts[trimmedPart] = (counts[trimmedPart] || 0) + 1;
        }
      });
    }
  });

  return counts;
}

function getColorAssignmentForTopTwoFrequent(row, oscarWinnerName) {
  const frequencyMap = getMovieFrequencyMap(row);
  const movieToColorClass = {};

  // Remove Oscar winner from frequency map if present
  if (oscarWinnerName && frequencyMap[oscarWinnerName]) {
    delete frequencyMap[oscarWinnerName];
  }

  // Filter movies mentioned 2 or more times
  const frequentMovies = Object.entries(frequencyMap)
    .filter(([movie, count]) => count >= 2);

  // Sort the frequent movies by frequency (descending)
  const sortedFrequentMovies = frequentMovies
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]); // Get only the movie names

  // Assign pink to the most frequent (if exists)
  if (sortedFrequentMovies.length > 0) {
    movieToColorClass[sortedFrequentMovies[0]] = repeatColors.first; // Pink
  }

  // Assign green to the second most frequent (if exists)
  if (sortedFrequentMovies.length > 1) {
    movieToColorClass[sortedFrequentMovies[1]] = repeatColors.second; // Green
  }

  return movieToColorClass;
}

const getHighlightedText = (value, movieToColorClass, oscarWinnerValue) => {
  // Check if value exists and is a string before using split
  if (!value || typeof value !== "string") return <span></span>;
  
  const parts = value.split(" / ");
  return parts.map((part, index) => {
    let className = "";
    let style = {};
    
    const trimmedPart = part.trim();

    // Check if it's the Oscar Winner
    if (oscarWinnerValue && 
        trimmedPart.toLowerCase() === oscarWinnerValue.toLowerCase()) {
      className = "highlight-oscar"; // Yellow
      style = { fontWeight: "bold" };
    // Check if it's one of the top two frequent movies (>=2 mentions)
    } else if (movieToColorClass[trimmedPart]) {
      className = movieToColorClass[trimmedPart]; // Pink or Green
    }
    // Otherwise, className remains empty (default white background)

    return (
      <span key={index} className={className} style={style}>
        {part}
        {index < parts.length - 1 && " / "} 
      </span>
    );
  });
};

const AwardTable = ({ data }) => {
  if (data.length === 0) return <p>Loading awards...</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className="award-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          // Get Oscar winner name
          const rawOscarWinnerValue = row["Oscar (Best Animated Feature)"];
          const actualOscarWinnerName = rawOscarWinnerValue ? 
            extractOscarWinnerName(rawOscarWinnerValue) : "";
            
          // Get color map for top two frequent movies (>=2 mentions)
          const movieToColorClass = getColorAssignmentForTopTwoFrequent(row, actualOscarWinnerName);

          return (
            <tr key={index}>
              {headers.map((key) => {
                const value = row[key] || ""; // Ensure value is never undefined
                const trimmedValue = typeof value === 'string' ? value.trim() : value;
                
                const isSplitValue = typeof value === "string" && value.includes(" / ");
                // Note: Special case for '12 Years a Slave / Gravity' might not apply here, removing for simplicity
                // const isSpecialCase = value === "12 Years a Slave / Gravity"; 

                // Determine the class for the cell (TD)
                let tdClassName = "";
                
                // If the cell contains the Oscar winner (and not a split value)
                if (!isSplitValue && actualOscarWinnerName && 
                    trimmedValue.toLowerCase() === actualOscarWinnerName.toLowerCase()) {
                  tdClassName = "highlight-oscar";
                // If the cell contains one of the top two frequent movies (and not a split value)
                } else if (!isSplitValue && movieToColorClass[trimmedValue]) {
                  tdClassName = movieToColorClass[trimmedValue];
                }
                // Otherwise, tdClassName remains empty (default white background)

                // Style for special split cases (if any were needed)
                const tdStyle = {}; 

                return (
                  <td key={key} className={tdClassName} style={tdStyle}>
                    {/* Use getHighlightedText for cells with split values to color parts individually */}
                    {isSplitValue
                      ? getHighlightedText(value, movieToColorClass, actualOscarWinnerName)
                      : value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AwardTable;