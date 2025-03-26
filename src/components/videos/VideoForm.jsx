import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoForm = () => {
  const navigate = useNavigate();
  const { video_id } = useParams(); 
  const [videoName, setVideoName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(video_id ? true : false); 


  useEffect(() => {
    if (video_id) {
      fetch(`http://15.206.194.89:5000/api/video/${video_id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch video');
          return res.json();
        })
        .then((data) => {
          setVideoName(data.video || '');
          setVideoLink(data.link || '');
          setPhoto(data.photo || '');
          setFetching(false); 
        })
        .catch((err) => {
          console.error('Error fetching video:', err);
          toast.error('Failed to load video data.');
          setFetching(false); 
        });
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
      const url = video_id ? `http://15.206.194.89:5000/api/video/${video_id}` : `http://15.206.194.89:5000/api/video`;

      const formData = new FormData();
      formData.append('video', videoName);
      formData.append('link', videoLink);
      if (photo) {
        formData.append('photo', photo); 
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(video_id ? 'Video Updated Successfully' : 'Video Created Successfully');
        setVideoName('');
        setVideoLink('');
        setPhoto(null);
        navigate('/videos');
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      <ToastContainer />
      <div className="p-4 rounded shadow-lg" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#f8f9fa' }}>
        <h2 className="mb-4 text-center" style={{ fontWeight: 600, color: '#343a40' }}>
          {video_id ? 'Edit Video' : 'Add New Video'}
        </h2>

        {fetching ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formVideoName">
              <Form.Label style={{ fontWeight: 500 }}>Video Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Video Name"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                required
                style={{ fontWeight: 400, fontSize: '1rem', borderRadius: '0.375rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategoryImage">
              <Form.Label style={{ fontWeight: 500 }}>Category Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])} 
                required={!video_id} 
                style={{
                  fontWeight: 400,
                  fontSize: '1rem',
                  borderRadius: '0.375rem',
                }}
              />
            </Form.Group>

            <Form.Group controlId="formVideoLink" className="mb-3">
              <Form.Label style={{ fontWeight: 500 }}>Video Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Video Link"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                required
                style={{ fontWeight: 400, fontSize: '1rem', borderRadius: '0.375rem' }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ width: '100%', padding: '10px', fontWeight: 600, fontSize: '1rem' }} disabled={loading}>
              {loading ? (video_id ? 'Updating...' : 'Adding...') : video_id ? 'Update Video' : 'Add Video'}
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default VideoForm;
