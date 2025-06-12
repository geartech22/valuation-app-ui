import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

import Bills from './Bills';
import Login from './Login';
import Dashboard from './Dashboard';
import Valuations from './Valuations';
import EmployeeGrid from './Employee';
import ErrorPage from './Error';

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

          {/* Catch-all route for 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}