import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UploadForm({ onUpload }) {
  const [mediaData, setMediaData] = useState({
    title: '',
    publisher: '',
    producer: '',
    genre: '',
    ageRating: 'PG',
    media: null,
    type: 'video'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media' && files.length > 0) {
      const file = files[0];
      // Only accept video files
      if (!file.type.startsWith('video/')) {
        alert('Please upload only video files');
        return;
      }
      setMediaData({ ...mediaData, media: file, type: 'video' });
    } else {
      setMediaData({ ...mediaData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  // Append all fields
  formData.append('title', mediaData.title);
  formData.append('publisher', mediaData.publisher);
  formData.append('producer', mediaData.producer);
  formData.append('genre', mediaData.genre);
  formData.append('ageRating', mediaData.ageRating);
  formData.append('media', mediaData.media);

  try {
    const response = await onUpload(formData);
    console.log('Upload response:', response.data); // Debug the response
    if (response.data && response.mediaUrl) {
      navigate('/'); // Redirect to home on success
    } else {
      throw new Error('No media URL returned');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}`);
  }
};

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <div className="upload-box p-4 rounded">
        <h2 className="form-heading mb-4 text-center">Upload Video</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Publisher"
              name="publisher"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Producer"
              name="producer"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select 
              name="genre" 
              onChange={handleChange}
              required
            >
              <option value="">Select Genre</option>
              <option value="Music">Music</option>
              <option value="Comedy">Comedy</option>
              <option value="Education">Education</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select 
              name="ageRating" 
              onChange={handleChange}
              required
            >
              <option value="PG">PG</option>
              <option value="G">G</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              name="media"
              onChange={handleChange}
              accept="video/*"
              required
            />
            <Form.Text>Only video files accepted (MP4, MOV, etc.)</Form.Text>
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Upload Video
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default UploadForm;