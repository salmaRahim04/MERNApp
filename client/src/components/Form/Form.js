import React, { useState , useEffect} from 'react';
import {  Container, Paper, TextField } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector} from 'react-redux';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import './styles.css';
import { createPost,updatePost } from '../../actions/posts';

const Form = ({currentId,setCurrentId}) =>{
    const post = useSelector(state=> currentId?state.posts.find(post=> post._id === currentId):null)
    
   const [postData,setPostData] = useState({
      title:'',message:'',tags:'',selectedFile:''
   })
   const [ToggleForm,setToggleForm] = useState(false)

   const dispatch = useDispatch();
   const user = JSON.parse(localStorage.getItem('profileUser'));
   useEffect(()=>{
     if(post){
        setPostData(post)
        window.scrollTo(0, 130);
        setToggleForm(true)
     }

   },[post])
   console.log(currentId);
   const clear = () =>{
      setPostData({creator:'',title:'',message:'',tags:'',selectedFile:''})
}
    const handleSubmit = (e) =>{
        e.preventDefault()
         if(!currentId){
            dispatch(createPost({...postData,name:user?.result?.name}));


         }else{
            dispatch(updatePost(currentId,{...postData,name:user?.result?.name}))
         
          
         }
        clear()
        }
    if(!user?.result?.name){
        return(
            <Container>
                <Paper className='SignInMessage'>
                Please Sign in to create your own memories 
            </Paper>
            </Container>
        )
    }
            console.log(postData);
    return (
        <>
       <div>
       <div className="devBtn"> <button className='FormBtn' onClick={()=> setToggleForm(!ToggleForm)}>{ ToggleForm === false?  <AddIcon fontSize="large"/> : <RemoveIcon fontSize="large"/>}</button></div>
        <Paper className={ ToggleForm === false? "FormCard HID" : 'FormCard'}>
            <form onSubmit={handleSubmit} className='form'  autoComplete='off'>
                <h3  className='formHeader'> {currentId ? 'Editing':'Add  new'} a post</h3>
                <TextField className="FormInput"  fullWidth name="title" label="Title"  value={postData.title} onChange={e=> setPostData({...postData,title:e.target.value})}/>
                <TextField  className="FormInput"  fullWidth name="message" label="Message"  value={postData.message} onChange={e=> setPostData({...postData,message:e.target.value})}/>
                <TextField className="FormInput"  fullWidth name="tags" label="Tags"  value={postData.tags} onChange={e=> setPostData({...postData,tags:e.target.value.split(',')})}/>
                <div className='fileInput '>
                    <FileBase
                     type="file"
                     multiple={false}
                     onDone={({base64})=> setPostData({...postData,selectedFile:base64})}

                    />
                   
      
                </div>
                 <button   className='Submit btn btn-white btn-animated'>Submit</button>
                 <button className='clear' onClick={clear}>Clear</button>

            </form>
        </Paper>
        

       </div>
        </>
    )
}

export default Form;