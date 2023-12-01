import React, { useState } from "react";

function Leaderboard() {
  const [quizId, setQuizId] = useState("");
  const [leaderboard, setLeaderboard] = useState(null);

  const fetchLeaderboard = (quizId) => {
    // Make sure quizId is provided
    if (quizId) {
      // Fetch leaderboard based on quizId
      fetch(`http://localhost:5057/api/Quiz/leaderboard/${quizId}`)
        .then(async (response) => {
          if (response.status === 404) {
            // Handle 404 separately
            setLeaderboard(null); // Clear previous records
            alert(`No leaderboard records available for ${quizId}`);
          } else {
            const data = await response.json();
            setLeaderboard(data);
          }
        })
        .catch((error) => console.error("Error fetching leaderboard:", error));
    } else {
      alert("Please provide a quizId");
    }
  };

  return (
    <div className="inputcontainer">
      <label className="form-control" htmlFor="quizId">
        Quiz ID
      </label>
      <input
        id="quizId"
        type="text"
        className="form-control"
        value={quizId}
        onChange={(e) => setQuizId(e.target.value)}
      />
  
      <button onClick={() => fetchLeaderboard(quizId)} className="btn btn-primary">
        Get Leaderboard
      </button>
  
      {leaderboard !== null && (
        <div>
          {leaderboard.length > 0 ? (
            <div>
              <h2>Leaderboard</h2>
              <ul>
                {leaderboard.map((entry, index) => (
                  <li key={index}>
                    <p>
                      Username: {entry.username}, Score: {entry.score}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No leaderboard records for this quiz.</p>
          )}
        </div>
      )}
    </div>
  );  
}

export default Leaderboard;