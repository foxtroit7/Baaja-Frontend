import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Signup = () => {
  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row className="w-100">
        <Col md={6} lg={8} xl={6} className='mx-auto'>
          <div className="border rounded p-4 shadow-sm bg-white">
            <h3 className="text-center mb-4 text-primary">Sign Up</h3>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter your password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm your password" />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
              <p className="text-center mt-3">
                Already have an account? <a href="/login" className="text-primary text-decoration-none">Login</a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
