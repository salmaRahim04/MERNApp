import React, { useEffect } from 'react';
import { CircularProgress, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Post from './Post/Post';

import './styles.css'

const Posts = ({currentId,setCurrentId}) =>{

  const posts  = useSelector(state=> state.posts)

  console.log(currentId);
    return (  
 !posts.length ? <div className='CircularProgress'><CircularProgress /></div> : (
  <Container>
   <div className='AllPosts'> 
   
   {posts.map(post=>{
        return(
          <div key={post._id} >
          <Post post={post} setCurrentId={setCurrentId} />
        </div>
        )
      })}
   
    </div>
    </Container>
)       
    )
}
export default Posts