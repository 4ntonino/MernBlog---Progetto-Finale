import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreatePost() {
  // Stato per gestire i dati del post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Stati per gestire il file di copertina, il caricamento e gli alert
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const navigate = useNavigate();

  // uso useEffect per recuperare l'email dell'utente all'avvio del componente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestiso i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };


  // Gestisco il cambio del file di copertina

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestisco l'invio del form

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Preparo i dati del form per l'invio

      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });
      if (coverFile) {
        formData.append("cover", coverFile);
      }
      // Invio i dati al server
      
      await createPost(formData);
      setAlert({ show: true, variant: 'success', message: 'Post creato con successo!' });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
      setAlert({ show: true, variant: 'danger', message: 'Errore nella creazione del post. Riprova.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h1 className="text-center mb-4 text-black">Crea un nuovo post</h1>
          {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
              {alert.message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Titolo</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={post.category}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="text-black">Contenuto</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={post.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Immagine di copertina</Form.Label>
                  <Form.Control
                    type="file"
                    name="cover"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Tempo di lettura (minuti)</Form.Label>
                  <Form.Control
                    type="number"
                    name="readTimeValue"
                    value={post.readTime.value}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="text-black">Email autore</Form.Label>
              <Form.Control
                type="email"
                name="author"
                value={post.author}
                readOnly
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Creazione in corso...' : 'Crea il post'}
            </Button>
          </Form>
          {loading && <ProgressBar animated now={100} className="mt-3" />}
        </Card.Body>
      </Card>
    </Container>
  );
}