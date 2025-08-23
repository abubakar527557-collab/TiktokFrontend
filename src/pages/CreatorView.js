import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import VideoCard from '../components/VideoCard';
import { getMedia, uploadMedia } from '../api';
// import { API_URL } from '../config'; // Import from config.js
// import axios from 'axios'; // Import axios


function CreatorView({ apiUrl }) {
  const [mediaList, setMediaList] = useState([]);
  
//  useEffect(() => {
//   const fetchMedia = async () => {
//     try {
//       const response = await getMedia();
//       // Ensure it's always an array
//       const data = Array.isArray(response.data) ? response.data : response.data.media || [];
//       setMediaList(data);
//     } catch (error) {
//       console.error('Error fetching media:', error);
//       setMediaList([]); // fallback to empty array
//     }
//   };
//   fetchMedia();
// }, []);

//  const handleUpload = async (formData) => {
//   try {
//     const response = await uploadMedia(formData);
//     const newMedia = response.data.media || response.data; 
//     setMediaList([newMedia, ...mediaList]);
//   } catch (error) {
//     console.error('Error uploading media:', error);
//     alert('Upload failed. Please try again.');
//   }
// };

useEffect(() => {
  const fetchMedia = async () => {
    try {
      const response = await getMedia();
      // response is already the data
      const data = Array.isArray(response) ? response : response.media || [];
      setMediaList(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMediaList([]);
    }
  };
  fetchMedia();
}, []);

const handleUpload = async (formData) => {
  try {
    const response = await uploadMedia(formData);
    // response is already just the data
    const newMedia = response.media || response;
    setMediaList([newMedia, ...mediaList]);
  } catch (error) {
    console.error('Error uploading media:', error);
    alert('Upload failed. Please try again.');
  }
};

  return (
    <div>
      <UploadForm onUpload={handleUpload} />
      <div className="media-feed">
        {mediaList.map((media, index) => (
          <VideoCard 
          key={media._id} 
          media={media}
          // onDelete={handleDelete}
          // isCreator={true} // Or use your actual role check
          
          />
        ))}
      </div>
    </div>
  );
}

export default CreatorView;