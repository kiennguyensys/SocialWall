import { combineReducers } from 'redux';
import stores from '../stores';

/**
 *  This file contains reducer definitions for redux actions.
 *  There are two main reducer actions defined in this file, first,
 *  FETCH actions are defined for handling new firestore snapshots,
 *  and then a user reducer is defined for mounting firestore user
 *  metadata to the local state.
 *
 *  @author rioam2
 *  @export {reducer} rootReducer
 */

// Define Firestore Fetch Reducers
// and store in the reducers array
const reducers = stores.map(store => ({
	[store]: (state = {}, action) => {
		switch (action.type) {
			case `${store}_FETCH`:
				return { ...action.payload };
			case `${store}_DETACH`:
				return {};
			default:
				return state;
		}
	}
}));

// Define User Reducer for mounting user metadata to local state
const authReducer = (state = null, action) => {
	switch (action.type) {
		case 'AUTH_LOGIN':
			return { ...action.payload };
		case 'AUTH_LOGOUT':
			return null;
		default:
			return state;
	}
};

const postReducer = (state = {arr:[]}, action) => {
	switch (action.type) {
		case 'GET_POST':
            return {
                ...state,
                arr: [...state.arr, action.payload]
            }
        case 'POST_DETACH':
        return {arr: []}
		default:
			return state;
	}
};

const commentReducer = (state = {arr:[]}, action) => {
	switch (action.type) {
        case 'CLEAR_COMMENT':
            return {arr : []}
		case 'GET_COMMENT':
            return {
                ...state,
                arr: [...state.arr, action.payload]
            }
		default:
			return state;
	}
};


// Combine each fetch reducer and the user reducer:
const allReducers = {
	...Object.assign({}, ...reducers),
    posts: postReducer,
    comments: commentReducer,
	user: authReducer
};

// Export the root reducer
const rootReducer = combineReducers(allReducers);
export default rootReducer;
