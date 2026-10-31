
import React, { useContext , useState ,useEffect} from 'react'
import "./Chatwindow.css"
import Chat from './Chat'
import { MyContext } from './MyContext.jsx'
import { DotLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

function Chatwindow() {
  const navigate = useNavigate();
  // Yahan setreply ko setReply kar diya hai
  const { prompt, setprompt, reply, setReply, currentThreadId, prevChats, setprevChats, setnewChat, setAuthenticated } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen  , setIsOpen] = useState(false);

  const getReply = async () =>{
    
    if (!prompt.trim()) return;

    setLoading(true);
    setnewChat(false)
    


    const options = {
      method:"POST", // 'Post' ko uppercase 'POST' kar dena behtar hai
      credentials: "include",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:prompt,
        threadId:currentThreadId
      })
    };
    try{
      const response = await fetch("http://localhost:3000/api/chat",options)
      const res = await response.json();
      console.log(res);

      if (!response.ok) {
        throw new Error(res.error || "Failed to get response");
      }

      setReply(res.reply) // Ab ye sahi se chalega
    }catch(e){
      console.log(e)
    } finally {
      setLoading(false);
    }
  }
  const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    console.log(data.message);
    setAuthenticated(false);
navigate('/login');
  } catch (error) {
    console.log("Logout error:", error);
  }
};
  useEffect(()=>{
    if(prompt && reply){
      setprevChats((prevChats)=>[...prevChats , {role:"user", content:prompt} , {role:"assistant", content:reply}])
    }
    setprompt("");
  },[reply])


    const handelprofileClick = () =>{
      setIsOpen(!isOpen)
    }


    const upgrade = () => {
    window.open(
        "https://developers.openai.com/api/docs/pricing",
        "_blank",
        "noopener,noreferrer"
    );

    console.log("Upgrade clicked");
};
  return (
    <div className='chatwindow'>
      <div className="navbar">
        <span>AsGpt </span>
        <div className="userIconDiv" onClick={handelprofileClick}>
          <span className='userIcon'><i className="fa-solid fa-user"></i></span>
        </div>

      </div>
      {
        isOpen && 
        <div className='dropDown'>
          <div onClick={upgrade} className="dropDownItem"> <i className='fa-solid fa-cloud-arrow-up'></i>Upgrade Plan</div>
          <div className="dropDownItem"><i className='fa-solid fa-gear'></i>Settings</div>
          <div className="dropDownItem" onClick={handleLogout}>
  <i className='fa-solid fa-arrow-right-from-bracket'></i>LogOut
</div>
        </div>
      }
      
      <Chat></Chat>
      <div className="loaderContainer">
  <DotLoader
    color="#ffffff"
    loading={loading}
    size={30}
    speedMultiplier={0.8}
  />
</div>

      <div className="chatInput">
        <div className="inputBox">
          <input placeholder="Ask AsGpt" value={prompt} onChange={(e)=>setprompt(e.target.value)}
          onKeyDown={(e)=> e.key=== 'Enter' ? getReply() : ""}
          >
          </input>
          <div id="submit">
           <i 
  className="fa-solid fa-paper-plane" 
  onClick={() => prompt.trim() !== "" ? getReply() : ""}
></i>

          </div>
        </div>
        <p className='info'>
          AsGpt can make mistakes.Check important info.See Cookie Preferences.
        </p>
      </div>
    </div>
  )
}

export default Chatwindow
