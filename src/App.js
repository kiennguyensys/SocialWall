import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import auth from './firebase-redux/actions/auth';
import database from './firebase-redux/actions/database';
import SignIn from './components/signIn';
import WallSite from './components/wallSite';

const App = props => {
	App.propTypes = {
		user: PropTypes.shape({
			displayName: PropTypes.string.isRequired
		}).isRequired
	};
	// Return JSX:
	return (
		<div>
			{(!props.user ? <SignIn /> : <WallSite />)}
		</div>
	);
};

export default connect(
	state => ({
		user: state.user,
	}),
	null
)(App);
