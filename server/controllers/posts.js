import Post from "../models/Post.js";
import User from "../models/User.js";
/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    
    res.status(200).json(post);
  } catch (err) {
    console.log("Yes");
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  // console.log(req.body)
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const comment= async(req,res)=>{
  try {
    const { id } = req.params;
    const { C }=req.body;
    // console.log(C);
    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push(C);
    await post.save();
    res.status(200).json({ post });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}