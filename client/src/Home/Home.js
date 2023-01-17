import React,{useState,useEffect}  from 'react'
import {Container,AppBar,TextField,Button} from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import { useDispatch } from "react-redux";
import {getPosts,getPostsBySearch} from '../actions/posts'
import {useLocation, useNavigate } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Form from '../components/Form/Form';
import Posts from '../components/Posts/Posts';

function useQuery(){
   return new URLSearchParams(useLocation().search)
}
export const Home = () => {
    const [currentId,setCurrentId] = useState(null);
    const [search,setSearch] = useState('');
    const [searchBtn,setSearchBtn] = useState(false);
    const [tags,setTags] = useState([]);  
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
   // const page = query.get('page')|| 1;
    //const searchQuery = query.get("searchQuery");
  
    const searchPost = () => {
      if (search.trim() || tags) {
        dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
        navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
      } else {
        navigate('/');
      }
    };
  
   const handleKeyPress = (e) =>{
    if(e.keyCode === 13){
       searchPost()
    }
  

   }
    const handleAdd = (tag) => setTags([...tags,tag])
    const handleDelete = (tagDelete) => setTags(tags.filter(tag=> tag!== tagDelete))
    useEffect(()=>{
      dispatch(getPosts());
    },[currentId,dispatch]);
  return (
    <>
   
     <Form  currentId={currentId}/>
    <div className='devBtn'><Button onClick={() => setSearchBtn(!searchBtn)} className="searchbtn"> <img src="https://assets.codepen.io/2301174/icon-supervisor.svg" alt=""/></Button> </div>    
   <Container className={searchBtn==true? 'SHOW':'HIDE'}>
    <AppBar className="searchForm" position="static" color="inherit">
      <TextField
       name="search"
        variant="outlined" 
        fullWidth
        onKeyPress={handleKeyPress}
        onChange={(e)=> setSearch(e.target.value)}
        label="Search Memories"/>
        <ChipInput 
        style={{margin:'10px 0'}}
        variant="outlined" 
        value={tags} 
        label="Search tags" 
        onAdd={handleAdd} 
        onDelete={handleDelete}/>
        <Button style={{backgroundColor: 'rgb(29, 175, 143)',color:'#fff'}} onClick={searchPost} variant="contained" ><SearchIcon/> Search</Button>
     </AppBar> 
    </Container>
    <Posts setCurrentId={setCurrentId}/>
   
    </>
  )
}
