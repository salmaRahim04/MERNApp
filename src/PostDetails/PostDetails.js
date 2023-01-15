import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, Container } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../actions/posts';
import './postDetails.css'
const PostDetails = () => {
  const { post } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

 

  if (!post) return null;

  const openPost = (_id) => history.push(`/posts/${_id}`);

  



  return (
   <Container>
      <div className='PostDetails'>
     <div style={{position: 'relative'}}>      
    <img className='ImageDetail' src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
    </div>
      <div className='INFOdetails'>
         <h1 className="title" >{post.title}</h1>
          <h3  className="tag">{post.tags.map((tag) => `#${tag} `)}</h3>
          <p>" {post.message}"</p>
          <div className='CreartorInfo'>
          <h3 variant="h6" >Created by:<span> {post.name}</span></h3>
          <h3 variant="body1">{moment(post.createdAt).fromNow()}</h3>
          </div>
        </div>

      </div>

   
   </Container>
  );
};

export default PostDetails;