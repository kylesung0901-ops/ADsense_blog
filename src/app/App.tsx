import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminWrite from './pages/AdminWrite';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/admin/write" element={<AdminWrite />} />
          <Route path="/admin/edit/:id" element={<AdminWrite />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
