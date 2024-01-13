import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import React,{ useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SendIcon from '@material-ui/icons/Send';

import './chatRoom.css'
import { Button,TextField,TextareaAutosize } from "@material-ui/core";
const ChatComponent = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

 
  const socket = useRef();
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("profileUser")));
  const scrollRef = useRef();
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("http://localhost:5000/user");
      setFriends(res.data);
      console.log(res.data)
    };

    getFriends();
  }, []);
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user.result._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user?.followings?.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations/" + user.result._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.result._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user.result._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:5000/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleSearch = () => {
    const filtered = conversations.filter((c) => {
    const friendId = c.members.find((member) => member !== user.result._id);
    const matchingFriend = friends.find((friend) => friend._id === friendId);
      console.log(friendId,matchingFriend)
      return matchingFriend?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
    setFilteredConversations(filtered);
  };
  

   return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
          <TextField 
           placeholder="Search for friends"
           id="standard-basic"
          label="Friends searching"
          variant="standard"
         className="chatMenuInput"
        value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
     onKeyPress={(e) => {
      if (e.key === 'Enter') {
          handleSearch();
    }
 }}           />

           
{filteredConversations.length === 0 ? (
  conversations.map((c) => (
    <div key={c._id} onClick={() => setCurrentChat(c)}>
      <Conversation conversation={c} currentUser={user.result} />
    </div>
  ))
) : (
  filteredConversations.map((c) => (
    <div key={c._id} onClick={() => setCurrentChat(c)}>
      <Conversation conversation={c} currentUser={user.result} />
    </div>
  ))
)}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user.result._id} user={user.result} />
                    </div>
                  ))
                  
                  }
                </div>
                <div className="chatBoxBottom">
                  <TextareaAutosize
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    aria-label="minimum height"
                    minRows={3}
                    style={{ width: '100%' }}
                    >

                    </TextareaAutosize>
                  <Button variant="contained" color="primary"  endIcon={<SendIcon />} onClick={handleSubmit}>
                        Send
                      </Button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default ChatComponent;
