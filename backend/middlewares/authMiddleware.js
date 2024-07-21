import { verifyJWT } from "../utils/jwt.js";
import Author from "../models/Author.js";

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estraiamo il token dall'header Authorization
   
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Se non c'è un token, restituisci un errore 401 (Unauthorized)

    if (!token) {
      return res.status(401).send("mi spiace, manca il Token");
    }

  
    // Se il token è valido, decoded conterrà il payload del token (es. { id: '123' })
    const decoded = await verifyJWT(token);

    // Usa l'ID dell'autore dal token per trovare l'autore nel database

    const author = await Author.findById(decoded.id).select("-password");

    // Se l'autore non viene trovato nel database, restituisci un errore 401
    if (!author) {
      return res.status(401).send("Autore non trovato");
    }

    req.author = author;

    // Passiamo al prossimo middleware o alla route handler
    next();
  } catch (error) {
    // Se c'è un errore durante la verifica del tokendiamo questo messaggio con l'errore 404
   
    res.status(401).send("il token non è  valido");
  }
}; 