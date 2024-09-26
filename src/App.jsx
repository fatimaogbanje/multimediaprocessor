import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ResultDisplay from "./components/ResultDisplay";
import "./App.css";

const App = () => {
  const [resultData, setResultData] = useState(null);
  const API_KEY = ""; 

  const handleFileProcessed = async (initialResultData, file, fileType) => {
    try {
      
      setResultData(initialResultData);

      
      const prompt = `Analyze the following ${fileType}: ${file.name}. 
                      Request: ${initialResultData.request}. 
                      Please provide detailed analysis, including any relevant information about the content, such as objects detected in images, key features of videos, summary of PDFs, and data insights from Excel files.`;

      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            systemInstruction: {
              role: "user",
              parts: [
                {
                  text: "You are an AI that processes various file formats such as images, videos, PDFs, Excel, and CSV files. When provided with a file, you should analyze its content and return relevant insights based on the following user instructions:\n\n1. **Image Files (JPEG/PNG)**:\n   - Perform image classification and object detection.\n   - Provide labels for identified objects.\n   - If requested by the user, detect specific entities (e.g., cars, people).\n\n2. **Video Files (MP4/AVI)**:\n   - Analyze the video for scene changes, object tracking, and action recognition.\n   - Identify any key objects or events as specified by the user (e.g., detect scenes with people or cars).\n   - Provide timestamps for important events.\n\n3. **PDF Files**:\n   - Extract text and key elements from documents.\n   - Summarize or retrieve specific sections based on the user'''s request (e.g., extract headings, tables, or figures).\n\n4. **Excel/CSV Files**:\n   - Analyze and summarize the data.\n   - If requested, focus on specific columns or patterns (e.g., summarize sales data from column B).\n   - Perform calculations or identify trends in the data if applicable (e.g., compute averages, medians).\n\nIn your response, provide clear and concise output, formatted in text with relevant details and, if applicable, links to additional resources or downloadable files.\n",
                },
              ],
            },
            generationConfig: {
              temperature: 1,
              topK: 64,
              topP: 0.95,
              maxOutputTokens: 8192,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      const analysisText = result.candidates[0].content.parts[0].text;
      console.log(analysisText);

      const analysisData = JSON.parse(analysisText);
      console.log(analysisData);

      
      setResultData((prevData) => ({
        ...prevData,
        analysis: analysisData,
        file_name: file.name,
        file_type: fileType,
      }));

      console.log("Result:--", resultData);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="App">
      <h1>Multimedia2</h1>
      <FileUpload onFileProcessed={handleFileProcessed} />
      <ResultDisplay resultData={resultData} />
    </div>
  );
};

export default App;
