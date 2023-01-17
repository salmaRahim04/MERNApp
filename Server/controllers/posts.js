import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'


export const getPosts = async(req,res)=>{
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (err) {
        res.status(404).json({message:err.message});

    }
};
export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");//to ignore case
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}
export const createPost = async(req,res)=>{
    const post = req.body;
   
    const newPost = new PostMessage({...post,creator:req.userId,createAt:new Date().toISOString})
   try {
      await newPost.save();
      res.status(200).json(newPost);

   } catch (err) {
    res.status(404).json({message:err});

   }
};

 export const updatePost = async (req,res) =>{
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    console.log(updatedPost);

    res.json(updatedPost);
}

export const deletePost = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

    await PostMessage.findByIdAndRemove(id)
    res.json({message:'Post deleted successfully'});

}

export const likePost = async (req,res)=>{
    const {id} = req.params;
    if(!req.userId) return res.json({message:'Unauthenticated'})
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex(id => id === String(req.userId));
    if(index === -1) {
        //liking
        post.likes.push(req.userId)

    }else{
        //disliking
        post.likes = post.likes.filter(id => id!== String(req.userId));
    };
    const updtatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true});
    res.json(updtatedPost)

}