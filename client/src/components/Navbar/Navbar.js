import { Avatar,Button } from "@material-ui/core";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate,useLocation } from 'react-router-dom';
import decode from 'jwt-decode'
import './style.css';
const Navbar = () => {
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("profileUser")));
    console.log(user);
    const dispatch = useDispatch();
    const location = useLocation
    const logout = () =>{
         dispatch({type:'LOGOUT'});
         window.location.reload()

         setUser(null)
    }
    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);
      
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
          }
      
        setUser(JSON.parse(localStorage.getItem("profileUser")))
       }, [location])
    return(
        <div className="header">
     <Link style={{textDecoration: 'none'}} to="/">
     <div className="Title">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUjzTkmD232Re_7rR_BSIN3c_6R-WtN-fxdQ&usqp=CAU" alt="memories" width="50" />
        <h1 className="headerName">Our Memories</h1>
       </div>
       </Link>
       <div >
            {
                user? (
                    <div className="profile">
                     
                         <Avatar className="avatar" alt={user.result.name} src={user.result.imageIrl}>{user.result.name.charAt(0)}</Avatar>
                        <h3>{user.result.name} </h3>
                    
                        <button className="logOutBtn" onClick={logout}>Log out</button>
                   
                    </div>

                ):(
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>

                )
            }
       </div>
        </div>
    )
}
export default Navbar;