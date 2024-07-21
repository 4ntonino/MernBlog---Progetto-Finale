import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {

  // Stato per gestire i dati del form di registrazione

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
  });

  // Stati per gestire l'alert di feedback

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  // Gestisco i cambiamenti nei campi del form con handleChange

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestisco l'invio del form di registrazione con handkeSubmit 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Tenta la registrazione dell'utente

      await registerUser(formData);

      // Se la registrazione ha successo, mostra un alert di successo

      setAlertVariant('success');
      setAlertMessage('Registrazione avvenuta con successo!');
      setShowAlert(true);

      // Reindirizza alla pagina di login dopo 1 secondo

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Errore durante la registrazione:", error);

      // Se c'è un errore, mostra un alert di errore
      
      setAlertVariant('danger');
      setAlertMessage('Errore durante la registrazione. Riprova.');
      setShowAlert(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4 text-black">Registrazione</h2>
              {/* Alert per mostrare feedback all'utente */}
              {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                  {alertMessage}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                {/* Campo Nome */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {/* Campo Cognome */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="cognome"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {/* Campo Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {/* Campo Password */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {/* Campo Data di Nascita */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Data di Nascita</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataDiNascita"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {/* Pulsante di invio */}
                <Button variant="primary" type="submit" className="w-100">
                  Registrati
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}