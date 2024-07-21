import mailgun from "mailgun-js";

// Configura l'istanza di Mailgun con le credenziali dall'ambiente
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});


// Funzione per inviare email
export const sendEmail = async (to, subject, htmlContent) => {

    const data = {
      from: "antonino <noreply@gmail.com>", //<--- Mittente dell'email
      to, // <----Destinatario
      subject, // <-----Oggetto dell'email
      html: htmlContent, // <---- Contenuto HTML dell'email
    };

    try {
        // Invia l'email usando Mailgun
        const response = await mg.messages().send(data);
        console.log("Email inviata!! :", response);
        return response; 
      } catch (err) {
   
        console.error("Email non inviata :", err);
        throw error;
      }
    };
