import React,{useState,useEffect} from 'react';
import {Avatar,Paper,Grid, Container,Typography, Button} from '@material-ui/core';
import {GoogleLogin} from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {signin,signup} from '../../actions/auth';
const initialState = {firstName:'',lastName:'',email:'',password:'',confirmPassword:''};
const Auth = () =>{
    const [showPassword,setShowPassword] = useState(false);
    const [isSignup,setIsSignup] = useState(false);
    const [formData,setFormData] = useState(initialState);
    const [errorMessage,seterrorMessage] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleShowPassword = () => setShowPassword(prev=> !prev)
    const handleSubmit = (e) =>{
        e.preventDefault()
        if(isSignup){
                dispatch(signup(formData,navigate,seterrorMessage))
        }else {
               dispatch(signin(formData,navigate,seterrorMessage))
        }

    }

    const handleChange= (e) =>{
        e.preventDefault()
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    const googleSuccess = (res) =>{
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
          dispatch({ type: 'AUTH', data: { result, token } });
          navigate('/');
        } catch (error) {
          console.log(error.message);
        }
    }
    const googleFailure =() =>{
        console.log("Google Sign In was unsuccessful, Try again")

    }
    const switchMode = () =>{
     setIsSignup(prev=> !prev)
     setShowPassword(false)
    }


    return(
        <Container component="main" maxWidth="xs">
            <Paper className={errorMessage==true? 'buttonerror LoginCard':'LoginCard'} >
               <div className='LoginHeader'>
                <Avatar>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography variant="h5">Sign {isSignup? 'Up':'In'}</Typography>
               
                </div>
                {errorMessage==true?<div className='errorMessage'>Something went wrong please try again</div>:null}

                <form className='LoginForm' onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                              
                               <Input  name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                               
                                <Input name="lastName" label="Last Name" handleChange={handleChange}  half/>
                             

                                </>
                            )
                        }
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                <Input name="password" label="Password" handleChange={handleChange} type={showPassword?'text':'password'} handleShowPassword={handleShowPassword}/>
                                {isSignup&& <Input label='Repeat Password' name="confirmPassword" handleChange={handleChange} type="password"/>}
                    </Grid>
                   
                    <button type='submit' onClick={handleSubmit} className="authBtn">
                    Sign {isSignup?'Up':'In'}
                    </button>
                    <GoogleLogin
      clientId="581459585994-n7s49u33ljn94qsc9r55v40jmt77q589.apps.googleusercontent.com"
      onSuccess={googleSuccess}
      onFailure={googleFailure}
      cookiePolicy="single_host_origin"
      render={renderProps => (
        <button onClick={renderProps.onClick} className="GoogleBtn">
          Google Sign In
        </button>
      )}
    />
                    <div>                   
                            <Button  onClick={switchMode}>
                            {isSignup?'Already have an account? Sign In':"Don't have an account? Sign Up"}
                            </Button>
                    </div>
                </form>
            </Paper>

        </Container>

    )
}
export default Auth;