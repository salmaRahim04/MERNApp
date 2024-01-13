import { Navigate } from 'react-router-dom';
import * as api from '../api';
import {AUTH,FETCH_USER} from '../Constants/actionTypes';


export const signin = (formData,navigate,seterrorMessage) => async (dispatch) =>{
       try {
        const {data} = await api.signIn(formData);
        dispatch({type:AUTH,data});
       const user = JSON.parse(localStorage.getItem('profileUser')).result
        navigate('/user/'+ user._id);
        window.location.reload()
       } catch (error) {
        seterrorMessage(true)

       }
}
export const signup = (formData,navigate,seterrorMessage ) => async (dispatch) =>{
    try {
    const {data} = await api.signUp(formData);
    dispatch({type:AUTH,data});
     navigate('/');
     window.location.reload()
    } catch (error) {
     console.log(error);
     seterrorMessage(true)
    }
}
export const getUser = (id) => async (dispatch) => {
    try {
      const { data } = await api.fetchUser(id);
      dispatch({ type: FETCH_USER,payload: { user: data } });
    } catch (error) {
      console.log(error);
    }
  };