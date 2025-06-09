import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://35.154.161.226:5000/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to dashboard or home
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{ background: '#f0f2f5' }}>
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Body>
              <h3 className="text-center mb-4" style={{ fontWeight: '600' }}>Login</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  style={{ fontWeight: '600', borderRadius: '8px' }}
                >
                  Login
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <p>
                  Don't have an account? <a href="/signup" style={{ textDecoration: 'none', fontWeight: '600' }}>Sign Up</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
