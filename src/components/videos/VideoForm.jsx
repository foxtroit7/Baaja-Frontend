import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const VideoForm = () => {
  const { video_id } = useParams();
  const [videoName, setVideoName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch existing data if editing
  useEffect(() => {
    if (video_id) {
      const fetchVideo = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://35.154.161.226:5000/api/video/${video_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch video');

          const data = await response.json();
          setVideoName(data.title);
          setVideoLink(data.link);
          setPhoto(data.photo); // You can preview it if needed
        } catch (error) {
          console.error('Error fetching video:', error);
          toast.error('Failed to fetch video data.');
        }
      };

      fetchVideo();
    }
  }, [video_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoName || !videoLink || (!photo && !video_id)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const method = video_id ? 'PUT' : 'POST';
      const url = video_id
        ? `http://35.154.161.226:5000/api/video/${video_id}`
        : `http://35.154.161.226:5000/api/video`;

      const formData = new FormData();
      formData.append('title', videoName);
      formData.append('link', videoLink);
      if (photo && typeof photo !== 'string') {
        formData.append('photo', photo);
      }

      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(video_id ? 'Video Updated Successfully' : 'Video Created Successfully');
        navigate('/videos');
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>{video_id ? 'Edit Video' : 'Add Video'}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Video Title</label>
          <input
            type="text"
            className="form-control"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Video Link</label>
          <input
            type="text"
            className="form-control"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Thumbnail</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files[0])}
            accept="image/*"
          />
          {photo && typeof photo === 'string' && (
            <img
              src={`http://35.154.161.226:5000/uploads/${photo}`}
              alt="Current thumbnail"
              style={{ width: '150px', marginTop: '10px' }}
            />
          )}
        </div>

        <button type="submit" className="btn bg-main mt-4" disabled={loading}>
          {loading ? "loading....." : video_id ? 'Update Video' : 'Add Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoForm;
