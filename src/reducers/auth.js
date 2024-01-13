import {FETCH_ERROR,AUTH,LOGOUT,FETCH_USER } from '../Constants/actionTypes';

export default  (state = {authData:null},action) =>{
    switch (action.type) {
        
        case AUTH:
            localStorage.setItem('profileUser', JSON.stringify({...action?.data}));
            return {...state,authData:action?.data};
       case LOGOUT:
            localStorage.removeItem('profileUser');
           return {...state,authData:null};
        case FETCH_USER:
            return  action.payload;
        case FETCH_ERROR:
            return action.payload;
        default:
            return state;
        
    }

}