import axios from 'axios';

const API = axios.create({baseURL:'http://localhost:5000'});
const url ='http://localhost:5000/posts';
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profileUser')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profileUser')).token}`;
    }
  
    return req;
  });
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchUser = (id) => API.get(`/user/${id}`);
export const fetchPosts =() => axios.get(url)
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const signIn = (formData) => API.post('/user/signin',formData);
export const signUp = (formData) => API.post('/user/signup',formData);