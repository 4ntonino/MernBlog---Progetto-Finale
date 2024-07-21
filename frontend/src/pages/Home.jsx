import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts } from "../services/api";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts();
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Errore nella fetch dei post:", error);
        setError("Si è verificato un errore nel caricamento dei post.");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const loadMore = () => {
    setVisiblePosts((prevVisible) => prevVisible + 6);
  };

  if (loading) {
    return (
      <div className="animated-background">
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Spinner animation="border" variant="light" />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animated-background">
        <Container className="text-center mt-5 text-white">
          <h2>Oops!</h2>
          <p>{error}</p>
          <Button variant="light" onClick={() => window.location.reload()}>Riprova</Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="animated-background">
      <Container fluid className="py-5 px-4">
        <motion.h1 
          className="text-center mb-5 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Esplora i Nostri Post
        </motion.h1>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          <AnimatePresence>
            {posts.slice(0, visiblePosts).map((post, index) => (
              <Col key={post._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-100 shadow hover-zoom bg-glass">
                    <div className="card-img-wrapper">
                      <Card.Img variant="top" src={post.cover} alt={post.title} />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5">{post.title}</Card.Title>
                      <Card.Text className="small text-muted mb-2">Autore: {post.author}</Card.Text>
                      <Link to={`/post/${post._id}`} className="mt-auto text-decoration-none">
                        <Button variant="outline-primary" size="sm" className="w-100">Leggi</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>
        {visiblePosts < posts.length && (
          <div className="text-center mt-4">
            {/* <Button variant="light" onClick={loadMore}>Carica altri</Button> */}
            <button type="button" class="btn btn-outline-light" onClick={loadMore}>Carica altri</button>
          </div>
        )}
      </Container>
    </div>
  );
}