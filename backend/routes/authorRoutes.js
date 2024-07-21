import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";

const router = express.Router();

// GET /authors
router.get("/", async (req, res) => {
  try {
    // Recupera gli autori dal database ("/")

    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/123: recupera il singolo autore
router.get("/:id", async (req, res) => {
  try {

    // Cerca un autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /authors: crea un nuovo autore
router.post("/", async (req, res) => {
  // Crea una nuova istanza di Author con i dati dalla richiesta
  const author = new Author(req.body);
  try {
    // Salva il nuovo autore nel database
    const newAuthor = await author.save();

    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;
    res.status(201).json(authorResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /authors/123: modifica l'autore con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna l'autore nel database
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /authors/123: cancella l'autore con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    // Trova e elimina l'autore dal database
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json({ message: "Autore eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    // Cerca l'autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    // Cerca tutti i blog post dell'autore usando la sua email
    const blogPosts = await BlogPost.find({ author: author.email });
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
