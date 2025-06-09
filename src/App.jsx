import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Bills from './Bills';
import Login from './Login';
import Dashboard from './Dashboard';
import Valuations from './Valuations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path='/valuations' element={<Valuations />} />
      </Routes>
    </BrowserRouter>
  );
}