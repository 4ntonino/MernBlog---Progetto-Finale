
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import 'bootstrap/dist/css/bootstrap.min.css';




import "./App.css";

function App() {
  return (
  
    <Router>
      <div className="App">
        {/* Navbar è renderizzato in tutte le pagine */}
        <Navbar />

        {/* Il tag main contiene il contenuto principale che cambia in base al routing */}
        <main>
          {/* Routes definisce le diverse rotte dell'applicazione */}
          <Routes>
            {/* Route per la home page */}
            <Route path="/" element={<Home />} />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            <Route path="/register" element={<Register />} />

            
            <Route path="/login" element={<Login />} />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
