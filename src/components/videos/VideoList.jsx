import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideoList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns] = useState(['Title', 'Thumbnail', 'Link', 'Actions']);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://35.154.161.226:5000/api/video', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleDelete = async (video_id) => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/video/${video_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.filter((item) => item.video_id !== video_id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleEditClick = (video_id) => {
    navigate(`/add-video/${video_id}`);
  };

  return (
    <Container>
      <h2 className="text-center my-4">YouTube Video List</h2>
      <Table className="table-responsive text-center table-striped">
        <thead className="bg-main text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="text-center">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.video_id}>
              <td className="text-center align-middle">{item.title}</td>
              <td className="text-center align-middle">
                <img
                  src={`http://35.154.161.226:5000/${item.photo}`}
                  alt="Thumbnail"
                  className="rounded shadow"
                  style={{
                    width: '110px',
                    height: '120px',
                    objectFit: 'cover',
                    border: '2px solid #007bff',
                  }}
                />
              </td>
              <td className="text-center align-middle">
                <Button href={item.link} target="_blank" className="mt-2 bg-main">
                  Video Link
                </Button>
              </td>
              <td className="text-center align-middle">
                <Button variant="warning" className="mt-2" onClick={() => handleEditClick(item.video_id)}>
                  <FontAwesomeIcon icon={faEdit} className="text-light" />
                </Button>
                <Button variant="danger" className="ms-2 mt-2" onClick={() => handleDelete(item.video_id)}>
                  <FontAwesomeIcon icon={faTrash} className="text-light" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default VideoList;
