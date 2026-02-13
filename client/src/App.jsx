import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RecentTranscripts from "./components/RecentTranscripts";
import TranscriptDetails from "./pages/TranscriptDetails";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <Routes>
      {/* Main Dashboard */}
      <Route path="/" element={<Landing />} />


      {/* Transcript details */}
      <Route path="/transcripts/:id" element={<TranscriptDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    
  );
}

export default App;
