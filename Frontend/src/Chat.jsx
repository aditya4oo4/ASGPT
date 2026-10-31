
import React, { useContext, useState, useEffect } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState("");

  useEffect(() => {
    if (reply === null || !reply) {
      setLatestReply("");
      return;
    }

    const words = reply.split(/(\s+)/);
    let idx = 0;

    setLatestReply("");

    const interval = setInterval(() => {
      setLatestReply((prev) => prev + (words[idx] || ""));
      idx++;

      if (idx >= words.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}

      <div className="chats">
        {/* Previous messages */}
        {Array.isArray(prevChats) &&
          prevChats.map((chat, idx) => (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={`${chat.role}-${idx}`}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content || ""}
                </ReactMarkdown>
              )}
            </div>
          ))}

        
        {reply && latestReply !== "" && (
          <div className="gptDiv" key="latest-reply">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
