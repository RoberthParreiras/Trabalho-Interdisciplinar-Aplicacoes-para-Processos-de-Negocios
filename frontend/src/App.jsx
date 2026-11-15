import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Estoque from './pages/Estoque';
import Fiado from './pages/Fiado';
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Tela inicial */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Telas do sistema */}
        <Route element={<MainLayout />}>
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/fiado" element={<Fiado />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}