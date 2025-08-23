import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { postComment, addRating, getComments } from '../api';

const VideoCard = ({ media, onDelete, isCreator }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(media?.averageRating || 0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const videoRef = useRef(null);

  const baseURL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  // Get file extension for video type
  const getVideoType = (url) => {
    if (!url) return 'mp4';
    const extension = url.split('.').pop()?.split('?')[0];
    return extension || 'mp4';
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (media?._id) {
          const response = await getComments(media._id);
          setComments(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };
    fetchComments();
  }, [media?._id]);

useEffect(() => {
  console.log('Current comments:', comments);
}, [comments]);

 const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setError(null);
    try {
    const newCommentResponse = await postComment(media._id, comment);
const newComment = newCommentResponse.comment || newCommentResponse;

if (newComment && newComment.userId) {
  setComments(prev => [...(prev || []), newComment]);
  setComment('');
  setSuccess('Comment posted successfully!');
} else {
  throw new Error('Invalid comment response structure');
}
    } catch (error) {
      console.error('Comment submission error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to post comment');
    } finally {
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await addRating(media._id, rating);
      setAverageRating(response.data?.averageRating || 0);
      setSuccess('Rating submitted!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  };

  // Format media URL properly
  // const formatMediaUrl = (url) => {
  //   if (!url) return '';
  //   if (url.startsWith('http')) return url;
    
  //   // Clean the URL path
  //   const cleanUrl = url
  //     .replace(/^undefined/, '')
  //     .replace(/\/+/g, '/')
  //     .replace(/^\//, '');
      
  //   return `http://localhost:5000/${cleanUrl}`;
  // };
 const formatMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;

    // Clean the URL path
    const cleanUrl = url
      .replace(/^undefined/, '') 
      .replace(/\/+/g, '/')     
      .replace(/^\//, '');     

    return `${baseURL}/${cleanUrl}`;
  };

  // Display comment author name
  const displayCommentAuthor = (comment) => {
    // Handle both populated user object and user reference
    if (comment.userId && typeof comment.userId === 'object') {
      return comment.userId.username || 'Anonymous';
    }
    return 'Anonymous';
  };
  // Safely handle media data with defaults
  const safeMedia = {
    title: media?.title || 'Untitled Video',
    publisher: media?.publisher || 'Unknown Publisher',
    producer: media?.producer || 'Unknown Producer',
    genre: media?.genre || 'Other',
    ageRating: media?.ageRating || 'Not Rated',
    mediaUrl: media?.mediaUrl || '',
    thumbnailUrl: media?.thumbnailUrl || '',
    people: media?.people || []
  };

  // Debugging logs
  console.log('Media object:', media);
  console.log('Final video URL:', formatMediaUrl(safeMedia.mediaUrl)); // 💜 shows formatted URL

  return (
    <Card className="video-card mb-4">
      <div className="video-container">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          onClick={handlePlay}
          onError={(e) => {
            console.error('Video error:', {
              error: e.target.error,
              src: formatMediaUrl(media?.mediaUrl),
              mediaObj: media
            });
          }}
          style={{ width: '100%', maxHeight: '500px', backgroundColor: '#000' }}
        >
          <source 
            src={formatMediaUrl(media?.mediaUrl)} // 💜 use fixed URL
            type={`video/${getVideoType(media?.mediaUrl)}`}
          />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <Card.Body>
        <Card.Title>{safeMedia.title}</Card.Title>
        <Card.Text className="text-muted">
          <small>Publisher: {safeMedia.publisher}</small><br />
          <small>Producer: {safeMedia.producer}</small><br />
          <small>Genre: {safeMedia.genre}</small><br />
          <small>Rating: {safeMedia.ageRating}</small>
        </Card.Text>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}

        <div className="comments-section mt-3">
          <h6>Comments ({comments.length})</h6>
          {comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            <ListGroup className="mb-3">
              {comments.map((c, i) => (
                <ListGroup.Item key={i}>
                  {/* <strong>{displayCommentAuthor(c)}: </strong> */}
                  {c.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          
          <Form onSubmit={handleCommentSubmit}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="outline-primary" type="submit" className="mt-2">
              Post Comment
            </Button>
          </Form>
        </div>

        <div className="rating-section mt-3">
          <div className="stars mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  cursor: 'pointer',
                  color: star <= (hoverRating || rating) ? 'gold' : 'gray',
                  fontSize: '1.5rem'
                }}
              >
                ★
              </span>
            ))}
          </div>
          <Button 
            variant="outline-secondary" 
            onClick={handleRatingSubmit}
            disabled={!rating}
          >
            Rate This Video
          </Button>
          <div className="mt-2">
            Average Rating: {averageRating.toFixed(1)}/5
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VideoCard;