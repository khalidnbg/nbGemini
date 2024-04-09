import { createContext, useState } from "react";
import runChat from "../config/gemini";

// Create a context to provide state and functions to other components
export const Context = createContext();

// Define the ContextProvider component
const ContextProvider = (props) => {
  // Define state variables
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Set up context value with state variables and functions
  const delayPara = (index, next) => {
    // Define a function to delay adding text to the resultData state
    setTimeout(() => {
      // Use setTimeout to delay the execution of the inner function
      setResultData((prev) => prev + next);
    }, 75 * index); // Set the delay time based on the index
  };

  // Define a function to reset loading and result state when starting a new chat
  const newChat = () => {
    // Set loading state to false
    setLoading(false);
    // Set showResult state to false
    setShowResult(false);
  };

  // Define an asynchronous function to handle sending messages
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    // Check if a prompt is provided
    if (prompt !== undefined) {
      // If a prompt is provided, send the prompt to the chat function and set recentPrompt state
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      // If no prompt is provided, add the input to the prevPrompt state and set recentPrompt state
      setPrevPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    // Split the response into an array using '**' as the delimiter
    let responseArray = response.split("**");
    let newResponse = "";
    // Iterate over the responseArray to format the respons
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    // Split the formatted response using '*' and join with '<br>' to create line breaks
    let newResponse2 = newResponse.split("*").join("</br>");
    // setResultData(newResponse2);

    // Split the newResponse2 into an array of words
    let newResponseArray = newResponse2.split(" ");
    // Iterate over the newResponseArray to add each word with a delay
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      // Call delayPara function to add the word with a delay
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    // Provide the context value to child components
    // eslint-disable-next-line react/prop-types
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
