import axios from "axios";

import { setAlert } from "../alert/alert.actions";
import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  ADD_POST,
  UPDATE_LIKES,
  CLEAR_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  DELETE_POST,
} from "./post.types";

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({ type: CLEAR_POST });
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add a new post
export const addPost = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post("/api/posts", formData, config);
    dispatch({ type: ADD_POST, payload: res.data });
    history.push("/posts");
    dispatch(setAlert("Successfully added a post", "is-success"));
  } catch (err) {
    // Send alerts
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "is-danger")));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post by ID
export const getPostById = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all posts of an user
export const getUserPosts = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/user/${userId}`);
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add like
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
    window.location.reload(false);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove like
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
    window.location.reload(false);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add a comment
export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );
    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert("Comment added", "is-success"));
    window.location.reload(false);
  } catch (err) {
    // Send alerts
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "is-danger")));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({ type: REMOVE_COMMENT, payload: commentId });
    dispatch(setAlert("Comment deleted", "is-danger"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a post
export const deletePost = (postId, history) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({ type: DELETE_POST, payload: postId });
    dispatch(setAlert("Post was deleted", "is-success"));
    history.push("/posts");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
