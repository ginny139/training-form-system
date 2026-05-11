import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import AdminDashboard from './pages/AdminDashboard';
import FormFillPage from './pages/FormFillPage';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/fill/:formTemplateId/:employeeId" element={<FormFillPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
