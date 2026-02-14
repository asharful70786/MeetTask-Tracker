import "./App.css";
import { Routes, Route, Router } from "react-router-dom";

import TranscriptDetails from "./pages/TranscriptDetails";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import HealthCheck from "./pages/HealthCheck";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer.jsx";
import AllTranscripts from "./components/AllTranscripts.jsx";


function App() {
  return (
    <>
    <Navbar/>
    
    
    <Routes>
       
      {/* Main Dashboard */}
      <Route path="/" element={<Landing />} />


      {/* Transcript details */}
      <Route path="/transcripts/:id" element={<TranscriptDetails />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/status" element={<HealthCheck />} />      
     <Route path="/transcripts" element={<AllTranscripts />} />
    </Routes>
     <Footer/>
    </>
    
  );
}

export default App;


