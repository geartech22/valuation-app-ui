import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

import Bills from './Bills';
import Login from './Login';
import Dashboard from './Dashboard';
import Valuations from './Valuations';
import EmployeeGrid from './Employee';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/valuations" element={<Valuations />} />
          <Route path="/employees" element={<EmployeeGrid />} />

          {/* Redirect all unknown routes to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}