import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewList from './components/Review-List';
import ReviewForm from './components/Review-Form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from './components/WebSocketProvider';
import './styles/App.scss';

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <Router>
        <div className="app">
          <h2>Live Reviews</h2>
          <Routes>
            <Route path="/" element={<ReviewList />} />
            <Route path="/new" element={<ReviewForm />} />
            <Route path="/:id" element={<ReviewForm />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
