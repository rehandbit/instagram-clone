import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import './Post.css'
import { db } from './firebase';


function Post({ postId, username, caption, imageUrl }) {
  const [comments,setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let xyz;
    if(postId) {
      xyz = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
      }
    return () => {
      xyz();
    }
  },[postId]);

  const postComment = (event) => {

  }

  return (
    <div className="post">
      <div className="postHeader">
        <Avatar className="postAvatar" src='/static/images/avatar/1.jpg' alt="avatar" />
        <h3> {username} </h3>
      </div>

      <img className="postImage" src={imageUrl} alt="image" />

      <h4 className="postText"><strong>{username} </strong> {caption}</h4>

      <div className="postComments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>{comment.text}
          </p>
        ))}
      </div>
      
      <form className='commentBox'>
        <input 
          className="postInput"
          type='text'
          placeholder='add a comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button 
          className="postButton"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  )
}
export default Post