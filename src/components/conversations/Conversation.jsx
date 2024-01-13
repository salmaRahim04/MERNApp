import axios from "axios";
import React,{ useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import './conversation.css'
export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
      
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:5000/user/" + friendId);
        setUser(res.data);
        console.log(res.data)
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversation">
  {
           user?.selectedFile  ? 
           <img src={user?.selectedFile} className='conversationImg' alt='hi' /> :
           <Avatar className="conversationImg"  alt={user?.name} src={user?.imageIrl}>{user?.name.charAt(0)}</Avatar>
       }
          <span className="conversationName">{user?.name}</span>
    </div>
  );
}