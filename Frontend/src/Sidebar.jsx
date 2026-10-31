
import React, { useEffect, useContext, useState } from "react";
import "./Sidebar.css";
import logo from "./assests/logo3.png";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThread,
    setallThread,
    currentThreadId,
    setnewChat,
    setprompt,
    setReply,
    setcurrentThreadId,
    setprevChats,
  } = useContext(MyContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getAllThread = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/thread", {
        credentials: "include"
      });

      if (!response.ok) {
        setallThread([]);
        return;
      }

      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setallThread(filteredData);
    } catch (e) {
      console.log("Error in sidebar:", e);
    }
  };

  useEffect(() => {
    getAllThread();
  }, [currentThreadId]);

  const createNewChat = () => {
    setnewChat(true);
    setprompt("");
    setReply("");
    setcurrentThreadId(uuidv1());
    setprevChats([]);
    setIsSidebarOpen(false);
  };

  const changeThread = async (newThreadId) => {
    setcurrentThreadId(newThreadId);
    setIsSidebarOpen(false);

    try {
      const response = await fetch(
        `http://localhost:3000/api/thread/${newThreadId}`,
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        return;
      }

      const res = await response.json();
      console.log(res);
      setprevChats(res);
      setnewChat(false);
      setReply(null);
    } catch (e) {
      console.log("Error changing thread:", e);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/thread/${threadId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const res = await response.json();
      console.log(res);

      if (!response.ok) {
        return;
      }

      setallThread(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currentThreadId) {
        createNewChat();
      }

    } catch (e) {
      console.log("error in the delete ", e);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isSidebarOpen}
      >
        <i className={`fa-solid ${isSidebarOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <section className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* New Chat */}
        <button onClick={createNewChat}>
          <img src={logo} alt="Logo" className="logo" />
          <span>
            <i className="fa-solid fa-pen-to-square newpen"></i>
          </span>
        </button>

        {/* Chat History */}
        <ul className="history">
          {Array.isArray(allThread) &&
            allThread.map((thread) => (
              <li
                key={thread.threadId}
                onClick={() => changeThread(thread.threadId)}
                className={thread.threadId === currentThreadId ? "highlighted" : ""}
              >
                {thread.title}
                <span className="delete-btn">
                  <i
                    className="fa-solid fa-trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.threadId);
                    }}
                  ></i>
                </span>
              </li>
            ))}
        </ul>

        {/* Footer */}
        <div className="sign">
          <p>By Adityaa Saini &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
