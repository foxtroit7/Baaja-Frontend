import { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Image } from 'react-bootstrap';
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

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <Image src="/baaja.png" alt="Baaja Logo" width={100} height={100} />
                <h2 className="" style={{ color: '#D20A2E', fontWeight: '700' }}>Baaja</h2>
              </div>

              <h4 className="text-center mb-4" style={{ fontWeight: '600' }}>Admin Login</h4>

              {error && <p className="text-danger text-center">{error}</p>}

              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label style={{ fontWeight: '500' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: '8px' }}
                    className='custom-placeholder'
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label style={{ fontWeight: '500' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: '8px' }}
                    className='custom-placeholder'
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 bg-main"
                >
                  Login
                </Button>
              </Form>

              {/* <div className="mt-4 text-center">
                <p style={{ fontSize: '0.95rem' }}>
                  Don't have an account?{' '}
                  <a href="/signup" style={{ textDecoration: 'none', color: '#D20A2E', fontWeight: '600' }}>
                    Sign Up
                  </a>
                </p>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
