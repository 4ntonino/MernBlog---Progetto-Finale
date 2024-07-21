
  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { Navbar, Nav, Container, Button } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import logo from "../../assets/logo.png";
  import "./styles.css";
  
  const glassStyle = {
    background: 'rgba(0,0,255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };
  
  export default function NavbarComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
      };
  
      checkLoginStatus();
      window.addEventListener('storage', checkLoginStatus);
  
      return () => {
        window.removeEventListener('storage', checkLoginStatus);
      };
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    };
  
    return (
      <Navbar expand="lg" sticky="top" className="py-1" style={glassStyle}>
        <Container>
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-dark">Home</Nav.Link>
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/create" className="text-dark">Nuovo Post</Nav.Link>
                  <Button variant="outline-dark" size="sm" onClick={handleLogout} className="ms-2">Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="text-dark">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-dark">Registrati</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }