import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEM_TYPE = 'ROW';

const VideoList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(['Category Of Instruments','Poster', 'Links', 'Actions']);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://35.154.161.226:5000/api/video');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleDelete = async (video_id) => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/video/${video_id}`);
      setData(data.filter((item) => item.video_id !== video_id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleEditClick = (video_id) => {
    navigate(`/add-video/${video_id}`); // Corrected to match the route
  };

  const DraggableRow = ({ item, index }) => {
    const [, drag] = useDrag(() => ({
      type: ITEM_TYPE,
      item: { index },
    }));

    const [, drop] = useDrop(() => ({
      accept: ITEM_TYPE,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          const updatedData = [...data];
          const [movedRow] = updatedData.splice(draggedItem.index, 1);
          updatedData.splice(index, 0, movedRow);
          setData(updatedData);
          setColumns();
          draggedItem.index = index;
        }
      },
    }));

    return (
      <tr ref={(node) => drag(drop(node))} style={{ cursor: 'move' }}>
        <td className="text-center align-middle">{item.video}</td>
        <td className="text-center"> <div className="image-container">
            <img
              src={`http://35.154.161.226:5000/${item.photo}`}
              alt={item.video}
              accept=''
              className=""
              width="50px"
              height="50px"
            />
          </div></td>
        <td className="text-center">
          <Button href={item.link} target="_blank" variant="primary" className='mt-2'>
            Video Link
          </Button>
        </td>
        <td className="text-center">
          <Button variant="warning" className='mt-2'  onClick={() => handleEditClick(item.video_id)}>
            <FontAwesomeIcon icon={faEdit} className='text-light' />
          </Button>
          <Button variant="danger" className="ms-2 mt-2" onClick={() => handleDelete(item.video_id)}>
            <FontAwesomeIcon icon={faTrash} className='text-light' />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <h2 className="text-center my-4">Video Lists</h2>
        <Table bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="text-center">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <DraggableRow key={item._id} index={index} item={item} />
            ))}
          </tbody>
        </Table>
      </Container>
    </DndProvider>
  );
};

export default VideoList;
