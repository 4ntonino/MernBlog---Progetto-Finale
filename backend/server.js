// Importazione dei moduli necessari
import express from "express"; // Framework web per Node.js
import mongoose from "mongoose"; // ODM per MongoDB
import dotenv from "dotenv"; // Per caricare variabili d'ambiente da file .env
import cors from "cors"; // Middleware per gestire CORS (Cross-Origin Resource Sharing)
import listEndpoints from "express-list-endpoints"; // Utility per elencare gli endpoints dell'app
import authorRoutes from "./routes/authorRoutes.js"; // Rotte per gli autori
import blogPostRoutes from "./routes/blogPostRoutes.js"; // Rotte per i blog post
import path from 'path';
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js"; // rotte accesso
import session from "express-session"; // Importiamo session
import passport from "./config/passportConfig.js"; // importiamo passport

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./middlewares/errorHandlers.js";

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Creazione dell'istanza dell'applicazione Express
const app = express();

// Applicazione dei middleware globali
app.use(cors()); // Abilita CORS per tutte le rotte
app.use(express.json()); // Parsing del corpo delle richieste in formato JSON

// Configurazione della sessione
app.use(
  session({
    // Il 'secret' è usato per firmare il cookie di sessione
    // È importante che sia una stringa lunga, unica e segreta
    secret: process.env.SESSION_SECRET,

    // 'resave: false' dice al gestore delle sessioni di non
    // salvare la sessione se non è stata modificata
    resave: false,

    // 'saveUninitialized: false' dice al gestore delle sessioni di non
    // creare una sessione finché non memorizziamo qualcosa
    // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
    saveUninitialized: false,
  })
);

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());


/* app.use("/uploads", express.static(path.join(__dirname, "uploads"))); */

// Connessione al database MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore di connessione MongoDB:", err));

// Definizione delle rotte principali
app.use("/api/auth", authRoutes);
app.use("/api/authors", authorRoutes); // Rotte per gli autori
app.use("/api/blogPosts", blogPostRoutes); // Rotte per i blog post

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 3000;

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);

  // Stampa tutte le rotte disponibili in formato tabellare
  console.log("Rotte disponibili:");
  console.table(
    listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    })),
  );
});