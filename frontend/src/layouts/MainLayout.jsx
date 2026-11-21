import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {Menu, X, LogOut, Boxes, List, CircleDollarSign, Users} from "lucide-react";
import { useAuth } from "../components/context/AuthContext";

export function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuAberto(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5EBD7] text-[#2A1A0F] flex flex-col font-sans pb-24">
      {/* HEADER */}
      <header className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-1 hover:opacity-80 transition"
            aria-label="Menu"
            type="button"
          >
            <Menu size={24} />
          </button>
          <div className="leading-none">
            <span className="text-[10px] font-bold tracking-widest text-[#F39C12] block">
              SGB
            </span>
            <span className="text-xl font-black tracking-tight text-[#E67E22] drop-shadow-sm">
              MAGAIVER
            </span>
          </div>
        </div>
      </header>

      {/* BACKDROP + SIDEBAR DRAWER */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark overlay — clicking outside closes the menu */}
          <div
            onClick={() => setMenuAberto(false)}
            className="fixed inset-0 bg-black/50"
          />

          {/* Drawer panel */}
          <aside className="relative w-64 max-w-[80%] bg-[#2E1A0F] text-[#F5EBD7] h-full flex flex-col justify-between p-5 shadow-xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#4A2D19]">
                <span className="text-lg font-black text-[#E67E22]">Menu</span>
                <button
                  onClick={() => setMenuAberto(false)}
                  className="p-1 hover:opacity-80 transition"
                  aria-label="Fechar menu"
                  type="button"
                >
                  <X size={22} />
                </button>
              </div>

              {usuario && (
                <div className="mt-4 text-sm text-[#EADCC8]">
                  <span className="text-xs text-gray-400 block">
                    Conectado como
                  </span>
                  <span className="font-bold">
                    {usuario.nome || usuario.usuario}
                  </span>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#4A2D19] hover:bg-red-700 text-[#F5EBD7] font-bold text-sm transition"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </aside>
        </div>
      )}

      {/* DYNAMIC PAGE CONTENT INJECTED HERE */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#2E1A0F] text-[#EADCC8] py-2 px-6 flex items-center justify-around border-t border-[#4A2D19] z-30 shadow-lg">
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
              isActive ? "text-[#E67E22]" : "text-gray-400 hover:text-white"
            }`
          }
        >
          <List size={20} />
          <span>Categorias</span>
        </NavLink>

        <NavLink
          to="/estoques"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
              isActive ? "text-[#E67E22]" : "text-gray-400 hover:text-white"
            }`
          }
        >
          <Boxes size={20} />
          <span>Estoque</span>
        </NavLink>

        {/* <NavLink
          to="/pedidos"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ClipboardList size={20} />
          <span>Pedidos</span>
        </NavLink> */}

        <NavLink
          to="/usuarios"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users size={20} />
          <span>Usuários</span>
        </NavLink>

        <NavLink
          to="/fiados"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
              isActive ? "text-[#E67E22]" : "text-gray-400 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`${isActive ? "bg-[#4A2D19] rounded-lg text-[#E67E22]" : ""}`}
              >
                <CircleDollarSign size={20} />
              </div>
              <span className={isActive ? "text-[#E67E22]" : ""}>Fiado</span>
            </>
          )}
        </NavLink>

        {/* <NavLink
          to="/cardapio"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen size={20} />
          <span>Cardápio</span>
        </NavLink> */}
      </footer>
    </div>
  );
}
