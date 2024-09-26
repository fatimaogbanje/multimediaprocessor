import React from "react";
import ReactMarkdown from "react-markdown";

const ResultDisplay = ({ resultData }) => {
  
  console.log("ResultData in ResultDisplay:", resultData);

  if (!resultData) {
    return <p>No results to display.</p>;
  }

  
  const renderNestedData = (data) => {
    if (!data || typeof data !== "object") {
      
      return <ReactMarkdown>{String(data)}</ReactMarkdown>;
    }

    return (
      <ul>
        {Object.entries(data).map(([key, value]) => {
          const isNumericKey = !isNaN(key);
          const displayKey = isNumericKey ? parseInt(key, 10) + 1 : key;

          return (
            <li key={key}>
              <strong>{displayKey}:</strong>
              {typeof value === "object" ? (
                renderNestedData(value)
              ) : (
                <ReactMarkdown>{String(value)}</ReactMarkdown>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="result-display">
      <h2>Processing Results</h2>

      
      <div>{renderNestedData(resultData)}</div>

      
      {resultData.downloadUrl && (
        <div>
          <h3>Download Processed File</h3>
          <a href={resultData.downloadUrl} download>
            Click here to download
          </a>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
