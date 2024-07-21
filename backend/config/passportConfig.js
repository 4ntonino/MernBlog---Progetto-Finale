
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

// Configuriamo l'autenticazione con Google

passport.use(
    new GoogleStrategy(
      {
        // Prendiamo le due variabili inserite sul file .env

        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        // Reindizziamo  dopo l'autenticazione con Google

         callbackURL: "/api/auth/google/callback"     //<<<<<<----------   FATTO A LEZIONE

                    //   - - - -   SULLA REPO : - - - -
       /*  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`  */
      },
      // Se è tutto ok:

      async (accessToken, refreshToken, profile, done) => {
        try {
          // Vediamo se esiste già un autore con lo stesso id
          let author = await Author.findOne({ googleId: profile.id });
  
          console.log("LOGIN dell'autore  -  ok", author);
  
          // Se l'autore non esiste, ne creiamo uno nuovo
          if (!author) {
              author = new Author({
              googleId: profile.id, 
              nome: profile.name.givenName, 
              cognome: profile.name.familyName, 
              email: profile.emails[0].value, 
              dataDiNascita: null, // <--  POSSIAMO ANCHE OMETTERLA
            });
            // Salviamo sul database
            await author.save();
          }
  
          // Passiamo l'autore al middleware di Passport
   
          done(null, author);
        } catch (error) {
          // Se si verifica un errore, lo passiamo a Passport
          done(error, null);
        }
      }
    )
  );
  

  // Indichiamo quali dati dell'utente dobbiamo salvare, in questo caso solo l'id

passport.serializeUser((user, done) => {
  
    done(null, user.id);
  });
  
 
  passport.deserializeUser(async (id, done) => {
    try {
      // Cerchiamo l'utente nel database usando l'ID
      const user = await Author.findById(id);
      // Passiamo l'utente completo al middleware di Passport
      done(null, user);
    } catch (error) {
      // Se si verifica un errore durante la ricerca, lo passiamo a Passport
      done(error, null);
    }
  });
  
  
  export default passport;