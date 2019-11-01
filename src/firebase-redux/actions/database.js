import Firebase from 'firebase';
import Admin from 'firebase-admin';
import firestoreDB from '../firestore';
import firebaseDB from '../firebase';
import store from '../store';

const database = {
	/**
	 *  Allows you to set the value of data on the firestore database.
	 *  This data flows back into the application through redux state.
	 *  @author rioam2
	 *  @param  {[String]} fieldString Field to update in 'dot-notation'.
	 *  														 Ex: `${StoreName}.field.subField`
	 *  														 Ex: settingsData.darkMode
	 *  @param  {[type]} value       The value to assign to the specified
	 *  														 field. Can be any datatype.
	 */
    searchUser: async(userEmail) => {
        let result = {id: '', email: ''};
        const usersRef = firestoreDB.collection('users');
        let query = await usersRef.where('email', '==', userEmail).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }

                snapshot.forEach(doc => {
                    result.id = doc.id;
                    result.email = doc.data().email
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
        });

        return result;
    },

    getUserInfo: (userID) => {
        const field = firestoreDB.doc(
            `/users/${userID}/userInfo/data`
        );
        field.get().then(docSnapshot => {
            if (!docSnapshot.exists) {
                field.set({});
            }
            field.onSnapshot(doc => {
                store.dispatch({
                    type: `userInfo_FETCH`,
                    payload: doc.data()
                });
            })
        });

    },

    getPosts: (userID) => {
        const postsRef = firestoreDB.collection('posts');

        let query = postsRef.where('author', '==', userID).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }

                snapshot.forEach(doc => {
                    store.dispatch({
                        type: `GET_POST`,
                        payload: {id : doc.id, ...doc.data()}
                    });
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
        });
    },

    createPost: (post) => {
		if (firebaseDB.auth().currentUser) {
            const id = firestoreDB.collection("posts").doc().id;
            console.log(id)
            firestoreDB.collection("posts").doc(id).set({
                image_url: post.image_url,
                title: post.title,
                author: firebaseDB.auth().currentUser.uid.toString(),
                invited_IDs: post.invited_IDs
            });

		}

    },

    createComment: (comment) => {
		if (firebaseDB.auth().currentUser) {
            const id = firestoreDB.collection("comments").doc().id;
            firestoreDB.collection("comments").doc(id).set({
                content: comment.content,
                post_id: comment.post_id,
                author: comment.author
            });

		}

    },

    getComments: (post_id) => {
        const commentsRef = firestoreDB.collection('comments');

        let query = commentsRef.where('post_id', '==', post_id).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }

                snapshot.forEach(doc => {
                    store.dispatch({
                        type: `GET_COMMENT`,
                        payload: doc.data()
                    });
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
        });
    },

	set: (fieldString, value) => {
		if (firebaseDB.auth().currentUser) {
			const [storeName, ...fieldpath] = fieldString.split('.');
			const field = firestoreDB.doc(
				`/users/${firebaseDB.auth().currentUser.uid}/${storeName}/data`
			);
			field.update({
				[`${fieldpath.join('.')}`]: value
			});
		}
	},
	/**
	 *  Allows you to delete an entry or field from the remote firestore database
	 *  This is done using the set method above.
	 *  @author rioam2
	 *  @param  {[String]} fieldString Field to update in 'dot-notation'.
	 *  														 Ex: `${StoreName}.field.subField`
	 *  														 Ex: settingsData.darkMode
	 */
	delete: fieldString => {
		database.set(fieldString, Firebase.firestore.FieldValue.delete());
	}
};

export default database;
