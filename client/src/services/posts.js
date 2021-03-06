import axios from 'axios';
import * as routes from 'constants/backendRoutes';

export const fetchAllPosts = () => {
  return axios.get(routes.postsBaseRoute);
};

export const fetchTotalPostCount = () => {
  return axios.get(routes.postCountRoute);
};

export const fetchRangeOfPosts = (start, end) => {
  return axios.get(routes.buildFetchRangeOfPostsRoute(start, end));
};

export const fetchPost = (postId) => {
  return axios.get(routes.buildFetchPostRoute(postId));
};

export const createPost = (title, body, userId) => {
  return axios.post(routes.postsBaseRoute, { title, body, user_id: userId });
};

export const addLikeToPost = (postId, userId, unliked = false) => {
  return axios.put(routes.buildAddLikeToPostRoute(postId), {
    user_id: userId,
    unliked,
  });
};
