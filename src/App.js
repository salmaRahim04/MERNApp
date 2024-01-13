import React,{useState} from "react";

import './style.css';
import Navbar from "./components/Navbar/Navbar";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Auth from "./components/Auth/Auth";
import { Home } from "./Home/Home";
import User from "./components/User/user";
import ChatRoom from "./components/User/chatRoom";
import Login from "./components/loginCard";
import Header from "./RegisterCard";
const App = () =>{
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("profileUser")));
    return(
        <>
        <BrowserRouter>
        <Navbar/>          
        <Routes>
        <Route path="/" exact element={<Home/>}/>
        <Route path="/auth" exact element={<Auth />} />
        <Route path="/posts/search" exact element={<Home />} />
        <Route path="/haha" exact element={<Login />} />
        <Route path="/hehe" exact element={<Header />} />


        {
        user && user.token ? (
    <>
      <Route path="/user/:id" exact element={<User />} />
      <Route path="/chatRoom" exact element={<ChatRoom />} />
    </>
  ) : null
}

        </Routes>
        </BrowserRouter>

        </>
    )
}
export default App;