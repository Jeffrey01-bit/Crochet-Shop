import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './ProductComments.css';

const timeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 10) return 'Just now';
    return Math.floor(seconds) + " seconds ago";
};

const ProductComments = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // comment ID we are replying to
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const commentsRef = collection(db, 'productComments', productId.toString(), 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [productId]);

    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert("Please sign in to comment.");
            return;
        }

        if (!newCommentText.trim()) return;

        setIsSubmitting(true);
        try {
            const commentsRef = collection(db, 'productComments', productId.toString(), 'comments');
            await addDoc(commentsRef, {
                text: newCommentText.trim(),
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Anonymous User',
                userPhoto: auth.currentUser.photoURL || null,
                createdAt: serverTimestamp(),
                parentId: parentId
            });

            // Reset form
            setNewCommentText('');
            setReplyingTo(null);

        } catch (error) {
            console.error("Error posting comment: ", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            await deleteDoc(doc(db, 'productComments', productId.toString(), 'comments', commentToDelete));
            setCommentToDelete(null);
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment.");
        }
    };

    const renderCommentInput = (isReply = false, parentId = null) => (
        <form className={`comment-input-form ${isReply ? 'reply-form' : ''}`} onSubmit={(e) => handleSubmit(e, parentId)}>
            {!auth.currentUser ? (
                <div className="login-prompt">
                    Please <Link to="/login" className="login-link">sign in</Link> to leave a comment.
                </div>
            ) : (
                <>
                    <textarea
                        placeholder={isReply ? "Write a reply..." : "Add a comment..."}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        disabled={isSubmitting}
                        rows="2"
                    />

                    <div className="comment-actions">
                        <div className="right-actions" style={{ marginLeft: 'auto' }}>
                            {isReply && (
                                <button type="button" className="cancel-reply-btn" onClick={() => setReplyingTo(null)}>
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="submit-comment-btn"
                                disabled={isSubmitting || !newCommentText.trim()}
                            >
                                {isSubmitting ? 'Posting...' : (isReply ? 'Reply' : 'Post')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );

    const renderCommentNode = (comment, allComments) => {
        const replies = allComments.filter(c => c.parentId === comment.id);
        const avatarInitial = comment.userName ? comment.userName.charAt(0).toUpperCase() : 'A';
        const isOwner = auth.currentUser?.uid === comment.userId;

        return (
            <div className="comment-thread">
                <div className="comment-node">
                    <div className="comment-avatar">
                        {comment.userPhoto ? (
                            <img src={comment.userPhoto} alt={comment.userName} />
                        ) : (
                            <div className="avatar-placeholder">{avatarInitial}</div>
                        )}
                    </div>
                    <div className="comment-content">
                        <div className="comment-header">
                            <span className="comment-author">{comment.userName}</span>
                            <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                        </div>
                        {comment.text && <p className="comment-text">{comment.text}</p>}

                        <div className="comment-footer">
                            {auth.currentUser && (
                                <button
                                    className="reply-btn"
                                    onClick={() => {
                                        setReplyingTo(comment.id);
                                        setNewCommentText('');
                                    }}
                                >
                                    Reply
                                </button>
                            )}
                            {isOwner && (
                                <button
                                    className="reply-btn"
                                    onClick={() => setCommentToDelete(comment.id)}
                                    style={{ color: 'var(--error-color, #dc3545)', marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        {replyingTo === comment.id && (
                            <div className="reply-input-wrapper">
                                {renderCommentInput(true, comment.id)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Render Replies Recursively */}
                {replies.length > 0 && (
                    <div className="replies-container">
                        {replies.map(reply => (
                            <React.Fragment key={reply.id}>
                                {renderCommentNode(reply, allComments)}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Filter top level comments
    const topLevelComments = comments.filter(c => !c.parentId);

    return (
        <section className="product-comments-section">
            <div className="comments-header">
                <h3>Customer Comments</h3>
                <span className="comments-count">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>

            {!replyingTo && (
                <div className="main-comment-input">
                    {renderCommentInput()}
                </div>
            )}

            <div className="comments-list">
                {topLevelComments.length === 0 ? (
                    <div className="no-comments">
                        <p>No comments yet. Be the first to start the discussion!</p>
                    </div>
                ) : (
                    topLevelComments.map(comment => (
                        <React.Fragment key={comment.id}>
                            {renderCommentNode(comment, comments)}
                        </React.Fragment>
                    ))
                )}
            </div>

            {/* Custom Glassmorphism Delete Modal */}
            {commentToDelete && (
                <div className="delete-modal-overlay" onClick={() => setCommentToDelete(null)}>
                    <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                        <h4>Delete Comment?</h4>
                        <p>Are you sure you want to permanently delete this comment? This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button className="delete-modal-cancel" onClick={() => setCommentToDelete(null)}>Cancel</button>
                            <button className="delete-modal-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductComments;
