import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import auth from '../firebase-redux/actions/auth';
import database from '../firebase-redux/actions/database';

const signIn = props => {
	signIn.propTypes = {
		user: PropTypes.shape({
			displayName: PropTypes.string.isRequired
		}).isRequired
	};
	// Return JSX:
	return (
		<div>
			<h2>
				{(props.user && `${props.user.displayName}, you are logged in`) ||
					'Please log in.'}
			</h2>
			<button onClick={() => auth.googleAuth()} type="button">
				Sign in
			</button>
			<button onClick={() => auth.signOut()} type="button">
				Sign out
			</button>
			<button
				onClick={() => database.delete('settingsData.test')}
				type="button"
			>
				Update Database
			</button>
		</div>
	);
};

export default connect(
	state => ({
		user: state.user,
	}),
	null
)(signIn);
