import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  ButtonBase,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection.js";

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width: 1000px)");

  useEffect(() => {
    dispatch(getPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [post, dispatch]);

  if (!post) return null;

  const openPost = (_id) => navigate(`/posts/${_id}`);

  if (isLoading) {
    return (
      <Paper
        elevation={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          borderRadius: "15px",
          height: "39vh",
        }}
      >
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexWrap: isMobile ? "wrap" : "nowrap",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{ borderRadius: "20px", margin: "10px", flex: 1 }}
          xs={12}
          md={6}
        >
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => (
              <Link
                to={`/tags/${tag}`}
                style={{ textDecoration: "none", color: "#3f51b5" }}
              >
                {` #${tag} `}
              </Link>
            ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">
            Created by:
            <Link
              to={`/creators/${post.name}`}
              style={{ textDecoration: "none", color: "#3f51b5" }}
            >
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <CommentSection post={post} />
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div
          style={{
            marginLeft: isMobile ? "0" : "20px",
            order: isMobile ? "-1" : "",
          }}
          xs={12}
          md={6}
        >
          <img
            style={{
              marginTop: "20px",
              borderRadius: "20px",
              objectFit: "cover",
              width: "100%",
              maxWidth: isMobile ? "100%" : "45vw",
              maxHeight: "600px",
            }}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div style={{ borderRadius: "20px", margin: "10px", flex: 1 }}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider style={{ margin: "10px 5px" }} />
          <Grid
            style={{ display: "flex", alignItems: "stretch" }}
            container
            spacing={3}
          >
            {recommendedPosts
              .slice(0, 8)
              .map(({ title, name, message, selectedFile, _id }) => (
                <Grid item key={_id} xs={12} sm={6} md={3}>
                  <ButtonBase
                    component="span"
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => navigate(`/posts/${_id}`)}
                  >
                    <Card
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "10px",
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                      raised
                      elevation={6}
                    >
                      <div
                        style={{
                          height: "100px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Typography
                          style={{ padding: "0 16px", fontSize: "12px" }}
                          variant="h5"
                          component="h3"
                          gutterBottom
                        >
                          {name}
                        </Typography>
                        <Typography
                          style={{ padding: "0 16px", fontSize: "16px" }}
                          variant="h5"
                          component="h2"
                          gutterBottom
                        >
                          {title.toUpperCase()}
                        </Typography>

                        <Typography
                          style={{ padding: "0 16px", fontSize: "10px" }}
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {message.split(" ").splice(0, 5).join(" ")}...
                        </Typography>
                      </div>
                      <img
                        src={selectedFile}
                        alt={title}
                        style={{
                          alignSelf: "flex-end",
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </Card>
                  </ButtonBase>
                </Grid>
              ))}
          </Grid>
        </div>
      )}
    </Paper>
  );
};

export default Post;
