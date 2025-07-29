import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        console.log("Fetching prompt...");
        const res = await axios.get("http://localhost:5000/api/prompts/today");
        console.log("Response:", res.data);
        setPrompt(res.data);
        setError(null);
      } catch (err) {
        console.error("Full error:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        // Set user-friendly error message
        if (err.response?.status === 404) {
          setError("No prompt found for today");
        } else if (err.code === 'ERR_NETWORK') {
          setError("Unable to connect to server. Please check if the backend is running.");
        } else {
          setError("Failed to load today's prompt");
        }
        setPrompt(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading today's prompt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Today's Prompt</h2>
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Today's Prompt</h2>
      {prompt && prompt.question ? (
        <div className="text-center">
          <p className="text-lg text-gray-800 leading-relaxed mb-4">{prompt.question}</p>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No prompt available for today.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyPrompt;