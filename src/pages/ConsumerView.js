import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { getMedia } from '../api';

function ConsumerView() {
  const [mediaList, setMediaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMedia();
        setMediaList(data);
      } catch (error) {
        console.error('Error fetching media:', error);
        setError(error.message);
        setTimeout(fetchMedia, 5000); // Retry after 5 seconds
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filteredMedia = mediaList.filter(media => 
    (media.title && media.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (media.caption && media.caption.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (media.location && media.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (media.people && media.people.some(person => 
      person.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div>
      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="You can search here..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="text-center my-4">Loading videos...</div>}
      {error && (
        <div className="alert alert-danger">
          Error: {error}
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-sm btn-warning ms-2"
          >
            Retry
          </button>
        </div>
      )}

      <div className="media-feed">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((media, index) => (
            <VideoCard key={index} media={media} />
          ))
        ) : (
          !loading && <div className="text-center my-4">No videos found</div>
        )}
      </div>
    </div>
  );
}

export default ConsumerView;