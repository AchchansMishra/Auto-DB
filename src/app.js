import React, { useState } from "react";
import Select from "react-select";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./app.css";

const options = [
{ value: "MongoDB", label: "MongoDB" },
{ value: "SQL", label: "SQL" },
{ value: "PostgreSQL", label: "PostgreSQL" },
{ value: "MariaDB", label: "MariaDB" },
{ value: "Firebase", label: "Firebase" },
{ value: "Prisma", label: "Prisma" },
{ value: "GraphQL", label: "GraphQL" },
{ value: "DynamoDB", label: "DynamoDB" },
];



function App() {
const [database, setDatabase] = useState(null);
const [queryInput, setQueryInput] = useState("");
const [generatedQuery, setGeneratedQuery] = useState("");
const [copySuccess, setCopySuccess] = useState(false);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
console.error("🚨 Missing API Key: GEMINI_API_KEY is undefined");
alert("API Key is missing! Please check your .env file.");
return null; 
}

const genAI = new GoogleGenerativeAI(apiKey);

const generateQuery = async () => {
if (!database || !queryInput) {
alert("Please select a database and enter a query.");
return;
}

const prompt = `Generate a ${database.value} query for: ${queryInput}`;

try {
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
const result = await model.generateContent([prompt]);
const response = await result.response;
const text = await response.text();

setGeneratedQuery(text);
setCopySuccess(false);
}
 catch (error) {
console.error("Error generating query:", error);
alert("Failed to generate query.");
}
};

const copyToClipboard = () => {
if (generatedQuery) {
navigator.clipboard.writeText(generatedQuery);
setCopySuccess(true);
setTimeout(() => setCopySuccess(false), 2000);
}
};



return (
<div className="App">
<h1>Database Query Generator!</h1>
<div className="appinner">
<Select
placeholder="Select Your Database.."
options={options}
className="react-select"
onChange={setDatabase}
 />

<textarea
rows={4}
className="query-input"
placeholder="Enter your Database Query. For Example, find all users who live in Kanpur..."
value={queryInput}
onChange={(e) => setQueryInput(e.target.value)}
/>

<button className="generate" onClick={generateQuery}>
Generate Query
</button>

{generatedQuery && (
<div className="result-text">
<p>Here is your Query!</p>
<pre>{generatedQuery}</pre>

<button className="copy-btn" onClick={copyToClipboard}>
Copy Query
</button>
{copySuccess && <span className="copy-success">✅ Copied!</span>}
</div>
)}

  </div>
 </div>

 );

}



export default App;