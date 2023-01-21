import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileBase from "react-file-base64";
import { TextField, Button, Typography, Paper, useTheme } from "@mui/material";

import { createPost, updatePost } from "../../actions/posts";

const Form = ({ setCurrentId, currentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });

  const theme = useTheme();

  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const clear = () => {
    setCurrentId(0);
    setPostData({
      title: "",
      message: "",
      tags: [],
      selectedFile: "",
    });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
    } else {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
    }
    clear();
  };

  if (!user?.result?.name) {
    return (
      <Paper style={{ padding: theme.spacing(2) }}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and rate other's!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      style={{ padding: theme.spacing(2), borderRadius: "10px" }}
      elevation={6}
    >
      <form
        autoComplete="off"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" style={{ paddingBottom: "10px" }}>
          {currentId ? "Editing" : "Creating"} a memory
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          required
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <div style={{ padding: "5px 0", width: "94%" }}></div>
        <TextField
          name="message"
          variant="outlined"
          multiline
          required
          rows={4}
          label="Message"
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <div style={{ padding: "5px 0", width: "94%" }}></div>
        <TextField
          name="tags"
          variant="outlined"
          required
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags.join(",")}
          onChange={(e) =>
            setPostData({
              ...postData,
              tags: e.target.value.replace(/\s/g, "").split(","),
            })
          }
        />
        <div style={{ width: "97%", margin: "10px 0" }}>
          <FileBase
            type="file"
            required
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          ></FileBase>
        </div>
        <Button
          style={{ marginBottom: 10 }}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          style={{ marginBottom: 10 }}
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
