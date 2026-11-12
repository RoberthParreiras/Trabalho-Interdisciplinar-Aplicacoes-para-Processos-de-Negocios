import { Outlet, NavLink } from 'react-router-dom';
import { Menu, Plus, Boxes, ClipboardList, Users, CircleDollarSign, BookOpen } from 'lucide-react';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F5EBD7] text-[#2A1A0F] flex flex-col font-sans pb-24">
      {/* HEADER */}
      <header className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button className="p-1 hover:opacity-80 transition" aria-label="Menu" type="button">
            <Menu size={24} />
          </button>
          <div className="leading-none">
            <span className="text-[10px] font-bold tracking-widest text-[#F39C12] block">SGB</span>
            <span className="text-xl font-black tracking-tight text-[#E67E22] drop-shadow-sm">MAGAIVER</span>
          </div>
        </div>
        <button className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow transition">
          <Plus size={18} strokeWidth={2.5} />
          <span>adicionar</span>
        </button>
      </header>

      {/* DYNAMIC PAGE CONTENT INJECTED HERE */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        <Outlet /> 
      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#2E1A0F] text-[#EADCC8] py-2 px-6 flex items-center justify-around border-t border-[#4A2D19] z-30 shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Boxes size={20} />
          <span>Estoque</span>
        </NavLink>
        
        <NavLink
          to="/pedidos"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ClipboardList size={20} />
          <span>Pedidos</span>
        </NavLink>
        
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
          to="/fiado"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          {({ isActive }) => (
            <>
              <div className={`${isActive ? 'p-1.5 bg-[#4A2D19] rounded-xl text-[#E67E22]' : ''}`}>
                <CircleDollarSign size={20} />
              </div>
              <span className={isActive ? 'text-[#E67E22]' : ''}>Fiado</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/cardapio"
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            isActive ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen size={20} />
          <span>Cardápio</span>
        </NavLink>
      </footer>
    </div>
  );
}