import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserForm from './components/UserForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        <header className="bg-blue-600 shadow text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">User Data Portal</h1>
          </div>
        </header>

        <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-8">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<UserForm />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
