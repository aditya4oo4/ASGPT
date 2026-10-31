
import Sidebar from "./Sidebar";
import Chatwindow from "./Chatwindow";
import { MyContext } from "./MyContext";
import "./App.css";
import { useState, useEffect } from "react";
import { v1 as uuidv1 } from 'uuid';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [prompt, setprompt] = useState("");
  const [reply, setReply] = useState("");
  const [currentThreadId, setcurrentThreadId] = useState(uuidv1());
  const [prevChats, setprevChats] = useState([]);
  const [newChat, setnewChat] = useState(true);
  const [allThread, setallThread] = useState([]);

  const [authenticated, setAuthenticated] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/me", {
          credentials: "include"
        });

        setAuthenticated(response.ok);
      } catch (error) {
        console.log("Session check error:", error);
        setAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const providervalues = {
    prompt,
    setprompt,
    reply,
    setReply,
    currentThreadId,
    setcurrentThreadId,
    newChat,
    setnewChat,
    prevChats,
    setprevChats,
    allThread,
    setallThread,
    authenticated,
setAuthenticated
  };

  if (checkingSession) {
    return <div>Checking session...</div>;
  }

  return (
    <MyContext.Provider value={providervalues}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={authenticated ? "/chat" : "/signup"} replace />
            }
          />

          <Route
            path="/signup"
            element={
              authenticated ? <Navigate to="/chat" replace /> : <Signup />
            }
          />

          <Route
            path="/login"
            element={
              authenticated ? <Navigate to="/chat" replace /> : <Login />
            }
          />

          <Route
            path="/chat"
            element={
              authenticated ? (
                <div className="app">
                  <Sidebar />
                  <Chatwindow />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
