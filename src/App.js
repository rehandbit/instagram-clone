import React,{ useEffect, useState }  from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const cleanUp = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //  when user is logged in....
        // console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out...
        setUser(null);
      }
    })
    return() => {
      // perform some cleanup actions 
      cleanUp();
    }
  }, [user, username]);


  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

      setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false);
  }
  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper} >
          <form className='appSignUp' >
            <center>
              <img 
                className='appHeaderImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                atl='insta'
              />
            </center>
            <Input 
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder='password'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='appSignUp'>
          <center>
            <img 
              className='appHeaderImage'
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt='inst'
            />
            </center>
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder='password'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn} >Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className='appHeader'>
        <img className='appHeaderImage' src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
        
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
          <div className='appLoginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      
      </div>
      <div className='appPost'>
        {
          posts.map(({id, post}) => (
            <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        <div className='imgUploaderStyle'>
          {user?.displayName ? (
            <ImageUpload username={user?.displayName} />
          ): (
            <h3>Please login to upload</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;