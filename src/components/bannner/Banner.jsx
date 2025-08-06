import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BannerList from './BannerList';
const Banner = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/add-banner'); 
      };
  return (
    <>
      <Container className="mt-5 mb-4">
        
      <Row>
        <Col className="d-flex justify-content-end">
          <Button onClick={handleButtonClick} className='bg-main'>Add New Banner</Button>
        </Col>
      </Row>
    </Container>
    <BannerList />
    </>
  )
}

export default Banner
