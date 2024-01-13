import React, { useEffect, useState } from 'react';
import {  CardActions, Button,Avatar,CardMedia } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import {useDispatch} from 'react-redux'
import { deletePost,likePost } from '../../../actions/posts';
import { getUser } from '../../../actions/auth';
import { useSelector } from 'react-redux';

import './styles.css';
import { Link, useNavigate } from 'react-router-dom';
const Post= ({post,setCurrentId}) =>{
const user = JSON.parse(localStorage.getItem('profileUser'));
const userId = user?.result.googleId || user?.result?._id;
const User = useSelector((state) => state.auth.user);
const navigate = useNavigate();
const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getUser(post.creator));

  },[dispatch])
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

  console.log(User)
    return (
    <>
      <ul className="cards">
  <li>
    <div className="card">
  
    <CardMedia
              component="img"
              alt="Post Image"
              className="card__image"
              height="300"
              image={post?.selectedFile || 'https://i.pinimg.com/originals/95/ce/08/95ce08653d0114069296e31c404da598.png'}
            />
      <div className="card__overlay" >
        <div className="card__header">
        <Link to={'/user/'+post.creator} className="no-underline"><svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>   
      {  post.creator === User?._id                   
         ? <img className="card__thumb" src={User?.selectedFile} alt="" />
          :<Avatar className="card__thumb" alt={User?.name} src={User?.imageIrl}>{User?.name?.charAt(0)}
          </Avatar>}
          </Link> 
         <div className="card__header-text">
         <Link to={'/user/'+post.creator} className="no-underline">
            <h3 className="card__title">{post.name}</h3>            
            </Link>
            <span className="card__status">{moment(post.createdAt).fromNow()}</span>
          </div>
       
        </div>
      <div className='content'>
      <p className='tags'>{post.tags.map((tag) => `#${tag} `)}</p>
      <p className="card__description">{post.title}</p>
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