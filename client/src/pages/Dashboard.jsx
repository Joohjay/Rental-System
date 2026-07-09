import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/authApi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">RentFlow</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-500 text-lg mb-6">
            Role: <span className="font-semibold text-blue-600">{user?.role}</span>
          </p>

          <div className="border-t pt-6 text-gray-600">
            <p className="mb-1"><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">User ID:</span> {user?.id}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;