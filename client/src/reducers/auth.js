import {FETCH_ERROR,AUTH,LOGOUT } from '../Constants/actionTypes';

export default  (state = {authData:null},action) =>{
    switch (action.type) {
        
        case AUTH:
            localStorage.setItem('profileUser', JSON.stringify({...action?.data}));
            return {...state,authData:action?.data};
       case LOGOUT:
           localStorage.clear();
           return {...state,authData:null};
        case FETCH_ERROR:
            return action.payload;
        default:
            return state;
        
    }

}