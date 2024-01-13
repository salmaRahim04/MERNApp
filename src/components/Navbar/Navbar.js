import { Avatar,Button } from "@material-ui/core";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate,useLocation } from 'react-router-dom';
import decode from 'jwt-decode'
import './style.css';
const Navbar = () => {
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("profileUser")));
    const dispatch = useDispatch();
    const location = useLocation
    const logout = () =>{
         dispatch({type:'LOGOUT'});
         window.location.reload()
              // Example: Clear user ID

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
       <img src="https://api.logo.com/api/v2/images?logo=logo_ddb8c000-1522-49b1-93e6-f187d6b2e06a&format=webp&margins=0&quality=60&width=500&background=transparent&u=1692926752" alt="memories" width="300" />
       </div>
       </Link>
       <div >
            {
                user? (
                  
                    //  <Link to={'/user/'+user.result._id}>
                
                    <div className="profile">
                     <Link to={'/user/'+user.result._id} className="no-underline">
                        <div className="profile">
                        {
                      user?.result?.selectedFile ? <img src={user?.result?.selectedFile} className='imgProfileNavbar'  alt='hi'/>:
                       <Avatar className=" useravatar imgProfileNavbar"   alt={user?.result.name} src={user?.result.imageIrl}>{user?.result.name.charAt(0)}</Avatar>
                         }                        
                         <h3>{user.result.name} </h3>
                        </div>
                        </Link>
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