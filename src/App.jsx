import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Bills from './Bills';
import Login from './Login';
import Workmanagement from './Workmanagement';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path='/workmanagement' element={<Workmanagement />} />
      </Routes>
    </BrowserRouter>
  );
}