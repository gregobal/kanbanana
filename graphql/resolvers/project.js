const {ApolloError} = require('apollo-server');

const User = require('../../models/User');
const Project = require('../../models/Project');


module.exports = {
  getProjects: async (userId) => {
    try {
      return await Project
        .find({creator: userId})
        .sort({createdAt: -1})
        .populate('creator');
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  createProject: async ({title, descr}, userId) => {
    try {
      const user = await User.findById(userId);
      const project = new Project({
        title,
        descr,
        creator: user
      });
      return await project.save()
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  updateProject: async ({projectId, title, descr}) => {
    try {
      return Project.findOneAndUpdate(
        {_id: projectId},
        {
          title,
          descr
        },
        {new: true}
      );
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
