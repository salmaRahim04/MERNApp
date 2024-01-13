import React,{useState,useEffect} from 'react'
import { Avatar, Button, Card, CardActions, CardHeader, CardMedia, CardContent,Modal, Backdrop, Fade} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../actions/posts';
import { getUser } from '../../actions/auth';
import EditProfileModal from './EditProfile';
import moment from 'moment';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ModeEditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import { Link, useParams } from 'react-router-dom';
import Form from '../Form/Form';
import './userStyle.css'
import { deletePost,likePost } from '../../actions/posts';
import Stories from 'react-insta-stories';
import axios from 'axios';
const User = () => {
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("profileUser")));
    const [followersCount, setFollowersCount] = useState(user?.followers?.length);
    const [isFollowing, setIsFollowing] = useState(false);
    const [Nposts, setNposts] = useState(0);
    const [Nfollowers,setNfollowers] = useState(0);
    const [currentId,setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const storedPhotos = JSON.parse(localStorage.getItem('uploadedPhotos')) || []; 
    const [stories, setStories] = useState([]);
    const [storyUser, setStoryUser] = useState(false);
    const { id } = useParams();
    const  posts = useSelector((state) => state.posts);
    const User = useSelector((state) => state.auth.user);
    const deleteExpiredPhotos = () => {
      const storedPhotos = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];
      const currentTime = new Date().getTime();
      const updatedPhotos = storedPhotos.filter(photo => {
        const createdAtTime = new Date(photo.createdAt).getTime();
        const timeDifference = currentTime - createdAtTime;
        const hoursElapsed = timeDifference / (1000 * 60 * 60);
        return hoursElapsed <= 24; // Keep photos uploaded within the last 24 hours
      });
      localStorage.setItem('uploadedPhotos', JSON.stringify(updatedPhotos));
    };
    let userStories = storedPhotos.filter(story => story.user === User?._id);
     console.log(userStories[0]);
    useEffect(() => {
      dispatch(getPosts());
      dispatch(getUser(id));
      const userPosts = posts.filter(post => post.creator === id);
      setNposts(userPosts.length);
      const backendUrl = 'http://localhost:5000'; // Update this with your backend server URL

      const updatedStories = userStories.map(photoDetails => {
      const createdAtTime = new Date(photoDetails.createdAt).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - createdAtTime;
      const hoursElapsed = timeDifference / (1000 * 60 * 60);
      const secondsElapsed = timeDifference / 1000;
      if (hoursElapsed <= 24) {
        let formattedDate = '';
        if (secondsElapsed < 60) {
          formattedDate = `${Math.floor(secondsElapsed)}s ago`;
        } else if (secondsElapsed < 3600) {
          formattedDate = `${Math.floor(secondsElapsed / 60)}m ago`;
        } else if (secondsElapsed < 86400) {
          formattedDate = `${Math.floor(secondsElapsed / 3600)}h ago`;
        } else {
          formattedDate = new Date(photoDetails.createdAt).toLocaleString(); // Fallback to full date for older photos
        } 
        console.log(formattedDate);
        return {
          content: () => (
            <div className='story-container' >
            <div className="user-info">
            {
           User?.selectedFile  ? 
           <img src={User?.selectedFile} className='profile-image' alt='hi' /> :
           <Avatar className="useravatar"  alt={User?.name} src={User?.imageIrl}>{User?.name?.charAt(0)}</Avatar>
       }
              <p style={{ color: '#fff' }}>{formattedDate}</p>
            </div>
            <img
              src={backendUrl + '/uploads/' + photoDetails.filename}
              alt="Story"
              className='story-image'
            />
          </div>
          )
        };
      }
     
      
        return null; // Don't include photos older than 24 hours in the stories
      }).filter(story => story !== null);
      setStories(updatedStories);
      deleteExpiredPhotos();
    }, [dispatch, id, posts]);
    const handleFileChange = async(event) => {
      const selectedFile = event.target.files[0];
      setSelectedFile(selectedFile);
      if (selectedFile) {
        const updatedStories = [...stories, { content: () => <img src={URL.createObjectURL(selectedFile)} alt="Story" className='story-image' /> }];
        setStories(updatedStories);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
        const res = await axios.post(`http://localhost:5000/stories/${user?.result?._id}/upload`, formData,{
          headers: {
            'Content-Type': 'multipart/form-data', // This header is usually set automatically by axios for FormData
          },
         });
         const uploadedPhotoDetails = res.data.photo;
         const storedPhotos = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];
         storedPhotos.push(uploadedPhotoDetails);
         localStorage.setItem('uploadedPhotos', JSON.stringify(storedPhotos));    
          console.log('Upload successful');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
   
    

      const handleClose = () => {
        setOpen(false);
      };
      const handleOpen = () => {
        setOpen(true);
      };

 const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/followers/follow/${User._id}`);
      setIsFollowing(true);
      setFollowersCount(prevCount => prevCount + 1);
            console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

 
  return (
    <div>
      <div className='userInfo'>
      <div onClick={handleOpen} className="profile-image-wrapper">
    
       {
        User?.selectedFile  ? <img src={User?.selectedFile} className='imgProfile  ' alt='hi' style={stories.length !== 0 && userStories[0]?.user == User?._id? {border:'3px solid green',cursor:'pointer'}:null}/> :
        <Avatar className="useravatar"style={stories.length !== 0 && userStories[0]?.user == User?._id ?  {border:'3px solid green',cursor:'pointer'}:null} alt={User?.name} src={User?.imageIrl}>{User?.name?.charAt(0)}</Avatar>
       }
        </div>
        <div>     
     {
      user?.result?._id === User?._id?   
       <div className="add-icon-wrapper">
      <label className="profile-image-label" htmlFor="file-input" style={{ cursor: 'pointer' }}>
        <AddIcon/>
      </label>
      <input  
       id="file-input"
       type="file"
       accept="image/*"
      onChange={handleFileChange}
      style={{ display: 'none' }}/>
    </div>    
    :null
    } 
    {
  userStories[0]?.user == User?._id &&
     <>
    <Modal
       open={open}
       onClose={handleClose}
       className="custom-modal"
       closeAfterTransition
       BackdropComponent={Backdrop}
       BackdropProps={{
         timeout: 500,
       }}
     >
       <Fade in={open}>
         <div className="modal-contentStory">
         <CloseIcon className="close-button" onClick={handleClose} />
         {stories.length > 0 && <Stories stories={stories} />}
           
         </div>
       </Fade>
     </Modal>
     </>
    }
      </div>

    
    
       <div>
       <div className='editContainer'>
       <h3>{User?.name} </h3>
      {
        User?._id == user?.result?._id? 
       <>
        <Button className="btn" onClick={handleOpenModal}>Edit Profile</Button>
        <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} user={user}/>
       </>
       :null 
      }
       </div> 
      <div  className='editContainer'>
      <div>
         {Nposts} posts
       </div>
       <div>
       <p>Followers: {followersCount}</p>
     
       {
  User?._id !== user?.result?._id ? (
    <>
      <button onClick={handleFollow} disabled={isFollowing}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>    </>
  ) : <></>
}
       </div>
       
   <Link to="/chatRoom">
       {
       User?._id == user?.result?._id? 
       <div
       style={{
         position: 'fixed',
         bottom: '20px', // Adjust the distance from the bottom as needed
         right: '20px', // Adjust the distance from the right as needed
         zIndex: 1000, // Adjust the z-index as needed
       }}
     >
       <ChatIcon color="primary" className='messageIcon'  />

        </div>
       :null 
      }
   </Link>
      </div>
       </div>
      </div>
       <Form currentId={currentId}  User={User} />
       <div className='posts'>
        {posts.map((post) => {
          return post.creator === id ? (
           
            <>
                 <div className="modal-content">
          <Card>
       
            <CardHeader
              avatar={ 
                User?.selectedFile  ? 
                <img  src={User?.selectedFile} className='imgProfile' alt='hi' /> :
                <Avatar  alt={User?.name} src={User?.imageIrl}>{User?.name.charAt(0)}</Avatar>
               }
              title={User?.name}
              subheader={moment(post?.createdAt).fromNow()}
            />
            <CardMedia
              component="img"
              alt="Post Image"
              height="300"
              image={post?.selectedFile || 'https://i.pinimg.com/originals/95/ce/08/95ce08653d0114069296e31c404da598.png'}
            />
            <CardContent>
              <h3>{post?.title}</h3>
              <p>{post?.message}</p>
              {post?.tags.map((tag) => {
                return <h4 className='tags'key={tag}>#{tag}</h4>;
              })}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                disabled={!user}
                onClick={() => dispatch(likePost(post?._id))}
              >
                {/* Like button */}
                {post?.likes?.length > 0 ? (
           post.likes.find(
          (like) => like === (user?.result?.googleId || user?.result?._id)
    ) ? (
      <>
        <ThumbUpAltIcon fontSize="small" />&nbsp;
        {post.likes.length > 2
          ? `You and ${post.likes.length - 1} others`
          : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}`}
      </>
    ) : (<>
      <ThumbUpAltOutlined fontSize="small" />&nbsp;
      {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
    </>
  )
) : (
  <>
    <ThumbUpAltOutlined fontSize="small" />&nbsp;Like
  </>
)}
              </Button>
              {user && (user?.googleId === post?.creator || user?.result?._id === post?.creator) ? (
                <>
                   <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
          <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
          <Button size="small" color="primary" onClick={() => setCurrentId(post._id)}><ModeEditIcon /> Edit </Button>
                </>
              ) : null}
            </CardActions>
          </Card>
        </div>


            </>
          
          ) : null;
          
        })}

      </div>

    </div>
  );
};





export default User;
