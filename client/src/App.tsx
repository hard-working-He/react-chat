import { Routes, Route, useLocation } from 'react-router-dom';
import Register from '@/pages/register';
import Login from '@/pages/login';
import Chat from '@/pages/chat';
import { withPrivateRoute } from '@/components/PrivateRoute';
import { useEffect } from 'react';
import { tokenStorage } from '@/common/storage';
import { useNavigate } from 'react-router-dom';

const ChatWithPrivateRoute = withPrivateRoute(Chat);
const App = () => {
  const navigate = useNavigate();
  // 每次路由变化时，都会执行这个函数
  const { pathname } = useLocation();
  useEffect(() => {
    const authToken = tokenStorage.getItem();
    if (authToken) {
      if (pathname === '/') {
        return;
      } else {
        navigate('/');
      }
    } else {
      if (pathname !== '/login' && pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<ChatWithPrivateRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
  export default App;