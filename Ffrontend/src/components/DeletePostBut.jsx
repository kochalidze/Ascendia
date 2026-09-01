import React from 'react';
import axios from 'axios';

import './styles/DeletePostBut.css';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
	'Content-Type': 'application/json',
  },
});

function DeletePostBut({postId, onDeleted}) {

	const deletePost = async () => {
		try {
			await api.delete(`/posts/delete-post/${postId}`);
			console.log(`Post with ID ${postId} deleted successfully.`);
			onDeleted(postId);
		} catch (error) {
			console.error('Error deleting post:', error);
		}
	};

	return (
		<button className='delete-post-but' onClick={deletePost}>Delete Post</button>
	)
}

export default DeletePostBut