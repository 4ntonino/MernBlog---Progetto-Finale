// Importa il modulo multer per la gestione dell'upload dei file
import multer from "multer";
// Importa il modulo path per la manipolazione dei percorsi dei file
import path from "path";

/* const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/'); //passiamo 2 parametri
    },
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + '+' + MathRound(Math.random() *1e9);
        cb(null,file.fieldname + '-' + uniqueSuffix +  path.extname(file.originalname) )
     }
});
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Supponendo che 'uploads' sia la tua cartella di archiviazione
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); 
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });



const upload =  multer({
    storage: storage
});

export default upload;