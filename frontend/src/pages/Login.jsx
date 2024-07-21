import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Google } from 'react-bootstrap-icons';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error("Errore durante il login:", error);
      setError("Credenziali non valide. Riprova.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <h4 className="text-center mb-4 text-primary">Benvenuto su StriveBlog!</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>

          <hr className="my-4" />

          <div className="d-grid gap-2">
            <Button variant="outline-danger" onClick={handleGoogleLogin}>
              <Google className="me-2" /> Login with Google
            </Button>
          {/*   <Button variant="outline-dark" onClick={handleGitHubLogin}>
              <Github className="me-2" /> Login with GitHub
            </Button> */}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}