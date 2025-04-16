import React from "react";
import "../App.css";

const repeatColors = [
  "highlight-repeat-1",
  "highlight-repeat-2",
  "highlight-repeat-3",
  "highlight-repeat-4",
];

function extractOscarWinnerName(value) {
  return value.includes(" / ") ? value.split(" / ")[0] : value;
}

function getRepeatedMoviesWithGroups(row) {
  const counts = {};
  const positions = {};

  Object.entries(row).forEach(([key, value]) => {
    if (typeof value === "string") {
      const parts = value.split(" / ");
      parts.forEach((part) => {
        counts[part] = (counts[part] || 0) + 1;
        if (!positions[part]) positions[part] = [];
        positions[part].push(key);
      });
    }
  });

  const repeatedValues = Object.keys(counts).filter((val) => counts[val] > 1);
  const valueToGroup = {};
  repeatedValues.forEach((val, idx) => {
    valueToGroup[val] = idx;
  });

  return valueToGroup;
}

const getHighlightedText = (value, repeatedGroups, oscarWinnerValue) => {
  const parts = value.split(" / ");
  return parts.map((part, index) => {
    let className = "";
    let style = {};

    // Verificar se a parte é o Oscar Winner e aplicar a cor amarela
    if (part.trim().toLowerCase() === oscarWinnerValue.trim().toLowerCase()) {
      className = "highlight-oscar"; // Amarelo para o Oscar Winner
      style = { fontWeight: "bold" }; // Tornar o Oscar Winner em negrito
    } else if (repeatedGroups.hasOwnProperty(part)) {
      // Aplicar cor para filmes repetidos (mas não o Oscar Winner)
      const groupIndex = repeatedGroups[part] % repeatColors.length;
      className = repeatColors[groupIndex]; // Verde, lilás, etc.
    }

    return (
      <span key={index} className={className} style={style}>
        {part}
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
          const repeatedGroups = getRepeatedMoviesWithGroups(row);
          const rawOscarWinnerValue = row["Oscar"];
          const actualOscarWinnerName = extractOscarWinnerName(rawOscarWinnerValue);

          return (
            <tr key={index}>
              {headers.map((key) => {
                const value = row[key];
                const isSplitValue = typeof value === "string" && value.includes(" / ");
                const isSpecialCase = value === "12 Years a Slave / Gravity";

                const tdClassName =
                  isSpecialCase || isSplitValue
                    ? "highlight-cell"
                    : value.trim().toLowerCase() === actualOscarWinnerName.trim().toLowerCase()
                    ? "highlight-oscar"
                    : repeatedGroups.hasOwnProperty(value)
                    ? repeatColors[repeatedGroups[value] % repeatColors.length]
                    : "";

                const tdStyle = isSpecialCase
                  ? {
                      background:
                        "linear-gradient(to bottom, #ffe599 50%, #d0f0d6 50%)",
                      color: "black",
                    }
                  : {};

                return (
                  <td key={key} className={tdClassName} style={tdStyle}>
                    {isSplitValue
                      ? getHighlightedText(value, repeatedGroups, actualOscarWinnerName)
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