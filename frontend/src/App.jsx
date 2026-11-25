import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import RotaProtegida from "./layouts/RotaProtegida";
import { AuthProvider } from "../src/components/context/AuthContext";
import Estoque from "./pages/Estoque";
import Fiado from "./pages/Fiado";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from './pages/Usuarios';
import Categoria from "./pages/Categoria";
import Cardapio from "./pages/Cardapio";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Tela inicial */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Telas do sistema protegidas*/}
          <Route element={<RotaProtegida />}>
            <Route element={<MainLayout />}>
              <Route path="/estoques" element={<Estoque />} />
              <Route path="/categorias" element={<Categoria />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/fiados" element={<Fiado />} />
              <Route path="/cardapio" element={<Cardapio />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
