import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Button,
  Card,
  Badge
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getLatestVideos } from '../api';
import VideoCard from '../components/VideoCard';

function DashboardView() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLatestVideos();
        
        // Handle different response structures
        const videoData = response.data?.results || 
                         response.data?.data || 
                         response.data || 
                         [];
        
        setVideos(Array.isArray(videoData) ? videoData : []);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const refreshVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLatestVideos();
      setVideos(response.data);
    } catch (err) {
      console.error('Error refreshing videos:', err);
      setError('Failed to refresh videos.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading latest videos...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Latest Videos 
          <Badge bg="primary" className="ms-2">
            {videos.length}
          </Badge>
        </h2>
        <Button 
          variant="outline-primary" 
          onClick={refreshVideos}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Videos'}
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <Button 
            variant="link" 
            onClick={refreshVideos}
            className="ms-2"
          >
            Retry
          </Button>
        </div>
      )}

      {videos.length > 0 ? (
        <Row>
          {videos.map((video) => (
            <Col key={video._id} lg={4} md={6} className="mb-4">
              <VideoCard media={video} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Videos Found</Card.Title>
            <Card.Text>
              There are no videos available yet. Be the first to upload content!
            </Card.Text>
            <Button as={Link} to="/creator" variant="primary">
              Upload Video
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default DashboardView;