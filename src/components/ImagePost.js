import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-responsive-modal';
import auth from '../firebase-redux/actions/auth';
import database from '../firebase-redux/actions/database';
import firebaseDB from '../firebase-redux/firebase';

function ImagePost (props) {
    const [modalIsOpen, changeModal] = useState(false)
    const [commentContent, setComment] = useState('')
    const [currentUser, setCurrentUser] = useState(firebaseDB.auth().currentUser.uid)

    const comments = useSelector(state => state.comments)
    const post = props.post
    const dispatch = useDispatch()

    const toggleModal = () => {
        changeModal(!modalIsOpen)
        dispatch({
            type: 'CLEAR_COMMENT',
            payload: {}
        });

        database.getComments(post.id)
    }

    const handleContent = (e) => {
        setComment(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(post.invited_IDs) {
            const array = post.invited_IDs
            console.log(array)
            if(array.includes(props.user.email)) {
                console.log('accepted')
                const comment = {
                    content: commentContent,
                    author: currentUser,
                    post_id: post.id
                }
                database.createComment(comment)
            }
        }
    }

    return (
        // <Modal open={modalIsOpen} onClose={changeModal(false)}>
        //     <img src={post.image_url} alt="Girl in a jacket" style={{width:500,height:500}}/>
        //     <form onSubmit={handleSubmit}>
        //       <label>
        //         content:
        //     <input type="text" value={commentContent} onChange={handleContent} />
        //       </label>
        //       <input type="submit" value="Create Comment" />
        //     </form>

        //     <div>
        //     {
        //         comments && comments.arr.map(comment => (
        //                 <h4>{comment.content}</h4>
        //         ))
        //     }


        //     </div>
        // </Modal>
        <div>
            <img src={post.image_url} alt="Girl in a jacket" onClick={toggleModal} style={{width:200,height:200}}/>
        </div>
    );
};

export default ImagePost;