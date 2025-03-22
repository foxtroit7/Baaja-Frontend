import React from 'react'
import CatagoryTable from './CatagoryTable'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Catagory = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/add-category'); 
      }; 
  return (
    <>
     <Container className="mt-5 mb-4">
      
      <Row>
        <Col className="d-flex justify-content-end">
          <Button onClick={handleButtonClick}>Add New Catagory</Button>
        </Col>
      </Row>
    </Container>
    <CatagoryTable />
    </>
  )
}

export default Catagory
