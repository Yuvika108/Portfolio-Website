import { Routes, Route } from "react-router-dom";
import './App.css'
import GestureDetector from "./gesturedetector";

function App() {
  return (
    <div className="w-full min-h-screen">
      {/* The gesture detector runs globally */}
      <GestureDetector />

      <Routes>
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-6xl font-bold text-white mb-4">My Portfolio</h1>
            <p className="text-gray-400 text-xl">Throw a gesture to interact</p>
          </div>
        } />
        <Route path="/creative" element={
          <div className="flex flex-col items-center justify-center min-h-screen text-center bg-purple-900/20">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8">
              Creative Dimension ✌️
            </h1>
            <p className="text-white text-2xl">You successfully navigated here using the Peace sign!</p>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
