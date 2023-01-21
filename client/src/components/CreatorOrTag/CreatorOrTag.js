import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { Typography, CircularProgress, Grid, Divider } from "@mui/material";

import Post from "../Posts/Post/Post";
import { getPostsByCreator, getPostsBySearch } from "../../actions/posts";

const CreatorOrTag = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name } = useParams();
  const { posts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (location.pathname.startsWith("/tags")) {
      dispatch(getPostsBySearch({ tags: name }));
    } else {
      dispatch(getPostsByCreator(name));
    }
  }, []);

  if (!posts.length && !isLoading) return "No posts";

  return (
    <div>
      <Typography variant="h2" textAlign="center">
        {name.toUpperCase()}
      </Typography>
      <Divider style={{ margin: "20px 0 50px 0" }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid item key={post._id} xs={12} sm={12} md={6} lg={6}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CreatorOrTag;
