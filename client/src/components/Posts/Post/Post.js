import React, { useState } from 'react';
import {  CardActions, Button,ButtonBase } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import {useDispatch} from 'react-redux'
import { deletePost,likePost } from '../../../actions/posts';
import './styles.css';
import { useNavigate } from 'react-router-dom';
const Post= ({post,setCurrentId}) =>{
const user = JSON.parse(localStorage.getItem('profileUser'));
const userId = user?.result.googleId || user?.result?._id;
const navigate = useNavigate();
  const dispatch = useDispatch();
    const Likes = () => {
    if (post?.likes?.length > 0) {
      return post.likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };
const OpenPost = () =>{
 navigate(`/posts/${post._id}`);
}
 
    return (
    <>
      <ul className="cards">
  <li>
    <div className="card">
  
     <img src={post.selectedFile||'https://i.pinimg.com/originals/95/ce/08/95ce08653d0114069296e31c404da598.png'} className="card__image" alt="" />
      <div className="card__overlay" >
        <div className="card__header">
          <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
          <img className="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
          <div className="card__header-text">
            <h3 className="card__title">{post.name}</h3>            
            <span className="card__status">{moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
      <div className='content'>
      <p className='tags'>{post.tags.map((tag) => `#${tag} `)}</p>
      <p className="card__description">{post.title}</p>
      <div onClick={OpenPost} className="detailsBtn">See details...</div>
     </div>
        <CardActions className="actions">
        <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(likePost(post._id))}>
             <Likes/>
         </Button>
         
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) ?
        (
         <>
           <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
          <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
          <Button size="small" color="primary" onClick={() => setCurrentId(post._id)}><ModeEditIcon /> Edit </Button>
         </>


        ):null}
      </CardActions>
      </div>
    </div>      
  </li>
 
</ul>
   
    </>
    )
}
export default Post