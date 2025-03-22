import React from 'react'
import VideoList from './VideoList'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Video = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/add-video');
  };
  return (
    <>
      <Container>
        <Row>
          <Col className="d-flex justify-content-end mt-4">
            <Button onClick={handleButtonClick} className='mt-4'>Add New Video</Button>
          </Col>
        </Row>
        <VideoList />
      </Container>
    </>
  )
}

export default Video
