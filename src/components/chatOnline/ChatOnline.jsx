import axios from "axios";
import React,{ useEffect, useState } from "react";
import  './chatOnline.css'
import { Avatar } from "@material-ui/core";
export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const axiosRequests = [];

  useEffect(() => {
    console.log('first')
    const getFriends = async () => {
      const res = await axios.get("http://localhost:5000/user");
      setFriends(res.data);
      console.log(res.data)
    };
    console.log(friends)

    getFriends();

// Loop through your friends and create Axios requests


  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    
  }, [friends, onlineUsers]);
   friends.forEach((friend) => {
    const requestData = {
      senderId: currentId,
      receiverId: friend._id,
    };
    console.log(requestData)
    const axiosRequest = axios.post('http://localhost:5000/api/conversations', requestData)
      .then((response) => {
        console.log('Response from server:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
    axiosRequests.push(axiosRequest);
  });
  
const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatOnline">
      {friends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
        <div className="chatOnlineImgContainer">
        {
           o?.selectedFile  ? 
           <img src={o?.selectedFile} className='chatOnlineImg' alt='hi' /> :
           <Avatar  className='chatOnlineImg' alt={o?.name} src={o?.imageIrl}>{o?.name.charAt(0)}</Avatar>
       }
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">{o?.username}</span>
      </div>
      ))}
    </div>
  );
}