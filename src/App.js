import React from "react";

import './style.css';
import Navbar from "./components/Navbar/Navbar";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Auth from "./components/Auth/Auth";
import { Home } from "./Home/Home";
import PostDetails from "./PostDetails/PostDetails";

//Public Blog App

const App = () =>{
    
    return(
        <>
        <BrowserRouter>
        <Navbar/>          
        <Routes>
        <Route path="/" exact element={<Home/>}/>
        <Route path="/posts/:id"  element={<PostDetails/>}/>
        <Route path="/posts/search" exact element={<Home/>} />
        <Route path="/auth" exact element={<Auth/>}/>
        </Routes>
        </BrowserRouter>

        </>
    )
}
export default App;