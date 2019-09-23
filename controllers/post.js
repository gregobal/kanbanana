const Post = require('../models/Post');

module.exports = {
  getPosts: async () => {
    try {
      return await Post.find();
    } catch (e) {
      console.error(e)
    }
  },

  createPost: async ({message}) => {
    const post = new Post({
      message
    });
    try {
      await post.save();
      return post
    } catch (e) {
      console.error(e)
    }
  }
};
