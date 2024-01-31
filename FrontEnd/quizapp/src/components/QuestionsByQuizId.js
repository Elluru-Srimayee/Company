// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./RegisterUser.css";

// function QuestionsByQuizId() {
//   const [questionList, setQuestionList] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [timeLimit,setTimeLimit]=useState(0);
//   const token = localStorage.getItem("token");
//   const [decrementInterval,setDecrementInterval]=useState(null);
//   const [totalQuestions,setTotalQuestions]=useState(0);
//   const [attemptCount, setAttemptCount] = useState(0);
//   useEffect(() => {
//     if (location.state && location.state.quizId) {
//       checkQuizCompletion(location.state.quizId);
//       getQuestionsByQuizId(location.state.quizId);
//       if(location.state.timeLimit>0){
//         setTimeLimit(location.state.timeLimit);
//         setTimeRemaining(location.state.timeLimit*60);
//         setDecrementInterval(setInterval(handleTimerTick,1000));
//       }
//       console.log("Timelimit is:",location.state.timeLimit);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     return () => {
//       clearInterval(decrementInterval); // Cleanup the timer on component unmount
//     };
//   }, [decrementInterval]);

//   const handleTimerTick = () => {
//     setTimeRemaining((prevTime) => {
//       if (prevTime > 0) {
//         return prevTime - 1;
//       } else {
//         clearInterval(decrementInterval);
//         handleQuizCompletion();
//         return 0;
//       }
//     });
//   };

//   // const checkQuizCompletion = (quizId) => {
//   //   const username = localStorage.getItem("username");

//   //   fetch(`http://localhost:5057/api/QuizResult/results-with-total-score/${username}/${quizId}`, {
//   //     headers: {
//   //       Authorization: `Bearer ${token}`,
//   //       "Content-Type": "application/json",
//   //     },
//   //   })
//   //     .then(async (response) => {
//   //       const data = await response.json();

//   //       if (data.quizResults.length > 0) {
//   //         alert("You have already completed this quiz. Multiple attempts are not allowed.");
//   //         navigate("/quizresult", {
//   //           state: {
//   //             username: localStorage.getItem("username"),
//   //             quizId: location.state.quizId,
//   //           },
//   //         })
//   //       } else {
//   //         getQuestionsByQuizId(quizId);
//   //       }
        
//   //     })
//   //     .catch((error) => console.error("Error checking quiz completion:", error));
//   // };
//   const checkQuizCompletion = (quizId) => {
//     const username = localStorage.getItem("username");

//     fetch(`http://localhost:5057/api/QuizResult/results-with-total-score/${username}/${quizId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then(async (response) => {
//         const data = await response.json();

//         if (data.quizResults.length > 0) {
//           const totalScore = data.quizResults[0].totalScore;
//           const passingScore = (totalQuestions / 2);
//           console.log('passingScore is: %d',passingScore);
//           console.log('totalQuestions is:%d',totalQuestions);

//           if (totalScore >= passingScore) {
//             // User passed the quiz, no more attempts allowed
//             alert("You have already completed this quiz with a passing score. No more attempts allowed.");
//             navigate("/quizresult", {
//               state: {
//                 username: localStorage.getItem("username"),
//                 quizId: location.state.quizId,
//               },
//             });
//           } else if (attemptCount < 2) {
//             // User failed, allow another attempt
//             setAttemptCount(attemptCount + 1);
//             getQuestionsByQuizId(quizId);
//           } else {
//             // User has already used all attempts, show appropriate message
//             alert("You have used all available attempts for this quiz.");
//             navigate("/quizresult", {
//               state: {
//                 username: localStorage.getItem("username"),
//                 quizId: location.state.quizId,
//               },
//             });
//           }
//         } else {
//           // No previous attempts, allow the user to take the quiz for the first attempt
//           setAttemptCount(1);
//           getQuestionsByQuizId(quizId);
//         }
//       })
//       .catch((error) => console.error("Error checking quiz completion:", error));
//   };

  
//   const getQuestionsByQuizId = (quizId) => {
//     fetch(`http://localhost:5057/api/Questions/byquiz/${quizId}`, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(async (data) => {
//         var myData = await data.json();
//         if(myData.length>0){
//         setQuestionList(myData);
//         if (myData.length > 0 && myData[0].timeLimit) {
//           setTimeRemaining(myData[0].timeLimit * 60); // Update time remaining when time limit changes
//         }
//         setTotalQuestions(myData.length); 
//       }
//       else{
//         alert('No questions available in this quiz yet!')
//         setTimeout(() => {
//           navigate("/quizs");
//         }, 0);
//       }
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };

//   const handleEvaluate = () => {
//     if (location.state.quizId && localStorage.getItem("username") && questionList.length > 0) {
//       const optionIndex = ['A', 'B', 'C', 'D'].indexOf(selectedOption);
//       const userAnswerValue = questionList[currentQuestionIndex][`option${optionIndex + 1}`];
//       const evaluationData = {
//         quizId: parseInt(location.state.quizId),
//         username: localStorage.getItem("username"),
//         questionId: questionList[currentQuestionIndex].questionId,
//         userAnswer: userAnswerValue,
//       };
//       fetch(`http://localhost:5057/api/Quiz/evaluate/${location.state.quizId}`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(evaluationData),
//       })
//         .then(async (response) => {
//           const data = await response.json();
//           if (currentQuestionIndex + 1 < questionList.length) {
//             setCurrentQuestionIndex(currentQuestionIndex + 1);
//             setSelectedOption(null);
//           } else {
//             handleQuizCompletion();
//           }
//         })
//         .catch((error) => console.error('Error evaluating quiz:', error));
//     } else {
//       alert('Please provide all required fields.');
//     }
//   };

//   const handleQuizCompletion = () => {
//     navigate("/quizresult", {
//       state: {
//         username: localStorage.getItem("username"),
//         quizId: location.state.quizId,
//       },
//     });
//   };

//   return (
//     <div className="inputcontainer">
//       <h1 className="alert alert-question">Quiz</h1>
//       {timeRemaining > 0 && (
//         <div className="alert alert-info">
//           Time Remaining: {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
//         </div>
//       )}
//       {(timeLimit===0 || timeLimit===null) && <div className="alert alert-info">No time limit for this quiz.</div> }
//       {questionList.length > 0 ? (
//         <div>
//           <div className="alert alert-question">
//            <p> Question {currentQuestionIndex+1} of {totalQuestions}: 
//             {questionList[currentQuestionIndex].questionTxt}
//             </p>
//           <form>
//             {['A', 'B', 'C', 'D'].map((option, index) => (
//               <div key={index} className="form-check">
//                 <input
//                   type="radio"
//                   id={`option${index}`}
//                   name="options"
//                   value={option}
//                   checked={selectedOption === option}
//                   onChange={() => handleOptionChange(option)}
//                   className="form-check-input"
//                 />
//                 <label htmlFor={`option${index}`} className="form-check-label">
//                   {option}: {questionList[currentQuestionIndex][`option${index + 1}`]}
//                 </label>
//               </div>
//             ))}
//           </form>
//           <button className="btn btn-primary" onClick={handleEvaluate}>
//             {currentQuestionIndex+1<totalQuestions?'Next':'Submit'}
//           </button>
//           </div>
//         </div>
//       ) : (
//         <p>No questions available for this quiz.</p>
//       )}
//     </div>
//   );
// }

// export default QuestionsByQuizId;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegisterUser.css";

function QuestionsByQuizId() {
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState(0);
  const token = localStorage.getItem("token");
  const [decrementInterval, setDecrementInterval] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (location.state && location.state.quizId) {
      
      checkQuizCompletion(location.state.quizId);
      getQuestionsByQuizId(location.state.quizId);
      if (location.state.timeLimit > 0) {
        setTimeLimit(location.state.timeLimit);
        setTimeRemaining(location.state.timeLimit * 60);
        setDecrementInterval(setInterval(handleTimerTick, 1000));
      }
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      clearInterval(decrementInterval); // Cleanup the timer on component unmount
    };
  }, [decrementInterval]);

  const handleTimerTick = () => {
    setTimeRemaining((prevTime) => {
      if (prevTime > 0) {
        return prevTime - 1;
      } else {
        clearInterval(decrementInterval);
        handleQuizCompletion();
        return 0;
      }
    });
  };

  const checkQuizCompletion = (quizId) => {
    const username = localStorage.getItem("username");

    fetch(`http://localhost:5057/api/QuizResult/results-with-total-score/${username}/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.quizResults.length > 0) {
          const totalScore = data.quizResults[0].totalScore;
          const passingScore = totalQuestions / 2;

          if (totalScore >= passingScore) {
            // User passed the quiz, no more attempts allowed
            alert("You have already completed this quiz with a passing score. No more attempts allowed.");
            navigate("/quizresult", {
              state: {
                username: localStorage.getItem("username"),
                quizId: location.state.quizId,
              },
            });
          } else if (attemptCount < 2) {
            // User failed, allow another attempt
            setAttemptCount(attemptCount + 1);
            getQuestionsByQuizId(quizId);
          } else {
            // User has already used all attempts, show appropriate message
            alert("You have used all available attempts for this quiz.");
            navigate("/quizresult", {
              state: {
                username: localStorage.getItem("username"),
                quizId: location.state.quizId,
              },
            });
          }
        } else {
          // No previous attempts, allow the user to take the quiz for the first attempt
          setAttemptCount(1);
          getQuestionsByQuizId(quizId);
        }
      })
      .catch((error) => console.error("Error checking quiz completion:", error));
  };

  const getQuestionsByQuizId = (quizId) => {
    fetch(`http://localhost:5057/api/Questions/byquiz/${quizId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (data) => {
        var myData = await data.json();
        if (myData.length > 0) {
          setQuestionList(myData);
          if (myData.length > 0 && myData[0].timeLimit) {
            setTimeRemaining(myData[0].timeLimit * 60); // Update time remaining when time limit changes
          }
          setTotalQuestions(myData.length);
        } else {
          alert("No questions available in this quiz yet!");
          setTimeout(() => {
            navigate("/quizs");
          }, 0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleEvaluate = () => {
    if (
      location.state.quizId &&
      localStorage.getItem("username") &&
      questionList.length > 0
    ) {
      const optionIndex = ["A", "B", "C", "D"].indexOf(selectedOption);
      const userAnswerValue =
        questionList[currentQuestionIndex][`option${optionIndex + 1}`];
      const evaluationData = {
        quizId: parseInt(location.state.quizId),
        username: localStorage.getItem("username"),
        questionId: questionList[currentQuestionIndex].questionId,
        userAnswer: userAnswerValue,
      };
      fetch(`http://localhost:5057/api/Quiz/evaluate/${location.state.quizId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      })
        .then(async (response) => {
          const data = await response.json();
          if (currentQuestionIndex + 1 < questionList.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
          } else {
            handleQuizCompletion();
          }
        })
        .catch((error) =>
          console.error("Error evaluating quiz:", error)
        );
    } else {
      alert("Please provide all required fields.");
    }
  };

  const handleQuizCompletion = () => {
    navigate("/quizresult", {
      state: {
        username: localStorage.getItem("username"),
        quizId: location.state.quizId,
      },
    });
  };

  return (
    <div className="inputcontainer">
      <h1 className="alert alert-question">Quiz</h1>
      {timeRemaining > 0 && (
        <div className="alert alert-info">
          Time Remaining:{" "}
          {Math.floor(timeRemaining / 60)
            .toString()
            .padStart(2, "0")}
          :{(timeRemaining % 60).toString().padStart(2, "0")}
        </div>
      )}
      {(timeLimit === 0 || timeLimit === null) && (
        <div className="alert alert-info">No time limit for this quiz.</div>
      )}
      {questionList.length > 0 ? (
        <div>
          <div className="alert alert-question">
            <p>
              {" "}
              Question {currentQuestionIndex + 1} of {totalQuestions}:
              {questionList[currentQuestionIndex].questionTxt}
            </p>
            <form>
              {["A", "B", "C", "D"].map((option, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    id={`option${index}`}
                    name="options"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionChange(option)}
                    className="form-check-input"
                  />
                  <label htmlFor={`option${index}`} className="form-check-label">
                    {option}:{" "}
                    {questionList[currentQuestionIndex][`option${index + 1}`]}
                  </label>
                </div>
              ))}
            </form>
            <button
              className="btn btn-primary"
              onClick={handleEvaluate}
              disabled={attemptCount >= 2}
            >
              {currentQuestionIndex + 1 < totalQuestions ? "Next" : "Submit"}
            </button>
          </div>
        </div>
      ) : (
        <p>No questions available for this quiz.</p>
      )}
    </div>
  );
}

export default QuestionsByQuizId;
