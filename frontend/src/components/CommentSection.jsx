import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { getStoredUser } from '../utils/auth';

const CommentSection = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const user = getStoredUser();

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.get(`/comments/task/${taskId}`);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/comments', { taskId, text: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="comments-section">
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Discussion</h3>
      
      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Add a comment..." 
          disabled={submitting}
          style={{ flexGrow: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={submitting}>Post</button>
      </form>

      {comments.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>No comments yet.</p>
      ) : (
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.user?.name || 'Unknown User'}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  {user?.id === comment.user?._id && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn-secondary"
                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', borderColor: 'transparent', color: 'var(--danger)' }}
                      title="Delete Comment"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', marginTop: '0.25rem', whiteSpace: 'pre-line' }}>{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
