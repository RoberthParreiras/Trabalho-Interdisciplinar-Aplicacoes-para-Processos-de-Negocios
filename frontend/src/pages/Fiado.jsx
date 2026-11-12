import React, { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FiadoCard } from '../components/FiadoCard';
import { INITIAL_FIADO } from '../data/mockFiado';

export default function Fiado() {

  async function getFiado() {
    const data = await fetch("http://localhost:3000/fiados/");

    if (!data.ok) return "Não foi possível carregar os fiados";

    return await data.json();
  }

  console.log(getFiado());

  const [fiadoList, setFiadoList] = useState(INITIAL_FIADO);
  const [activeTab, setActiveTab] = useState('fiado');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [orderBy, setOrderBy] = useState('vencimento');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtros dinâmicos e ordenação
  const filteredList = useMemo(() => {
    let list = fiadoList.filter((item) => {
      const matchSearch =
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cpf.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === 'todos' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (orderBy === 'vencimento') {
      list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (orderBy === 'valor') {
      list.sort((a, b) => b.totalDue - a.totalDue);
    } else if (orderBy === 'nome') {
      list.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return list;
  }, [fiadoList, searchTerm, statusFilter, orderBy]);

  const allSelected =
    filteredList.length > 0 &&
    filteredList.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja quitar ou remover este registro de fiado?')) {
      setFiadoList((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleEdit = (item) => {
    const newName = window.prompt('Editar nome do cliente:', item.clientName);
    if (!newName) return;
    const newTotal = parseFloat(
      window.prompt('Total devido (R$):', item.totalDue.toString()) || item.totalDue
    );

    setFiadoList((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, clientName: newName, totalDue: newTotal } : it
      )
    );
  };

  const handleAddClient = () => {
    const clientName = window.prompt('Nome do cliente:');
    if (!clientName) return;
    const totalDue = parseFloat(window.prompt('Total devido (ex: 160.00):') || '0');
    const dueDate = window.prompt('Data de vencimento (ex: 10/11):') || '10/11';

    const newItem = {
      id: Date.now().toString(),
      code: `#00${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      totalDue: totalDue || 0,
      dueDate,
      status: 'pendente',
    };

    setFiadoList((prev) => [newItem, ...prev]);
  };

  const topTabs = [
    { id: 'estoque', label: 'Gestão Estoque' },
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'usuarios', label: 'Controle Usuários' },
    { id: 'fiado', label: 'Controle Fiado' },
    { id: 'cardapio', label: 'Controle Cardápio' },
  ];

  return (
    <div className="min-h-screen bg-[#F5EBD7] text-[#2A1A0F] flex flex-col font-sans pb-24">
      {/* HEADER SUPERIOR */}
      {/* <header className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="leading-none">
          <span className="text-[10px] font-bold tracking-widest text-[#E67E22] block uppercase">
            SGB
          </span>
          <span className="text-xl font-black tracking-tight text-[#E67E22] drop-shadow-sm uppercase">
            MAGAIVER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#3F2618] flex items-center justify-center text-[#EADCC8] hover:opacity-90 transition"
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#C85327] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            AD
          </div>
        </div>
      </header> */}

      {/* ABAS RÁPIDAS */}
      <div className="bg-[#EADCC8] px-3 py-2 flex items-center gap-2 overflow-x-auto border-b border-[#D8C7B0] no-scrollbar">
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#C85327] text-white shadow-sm'
                : 'bg-[#FCF8F2] text-[#4A3525] border border-[#D8C7B0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <main className="p-4 max-w-lg mx-auto w-full flex-1 flex flex-col gap-4">
        {/* TÍTULO E BOTÃO ADICIONAR */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
                Controle Fiado
              </h1>
              <span className="text-sm font-semibold text-gray-600 font-mono">
                / (2948)
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Gestão de contas e recebimentos
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClient}
            className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
          >
            <span>Adicionar</span>
            <span>Cliente</span>
          </button>
        </div>

        {/* FILTROS E BUSCA */}
        <div className="bg-[#EADCC8] p-3 rounded-2xl border border-[#D8C7B0] flex flex-col gap-3">
          <div className="relative">
            <span className="absolute -top-2.5 left-3 bg-[#EADCC8] px-1.5 text-xs font-mono font-medium text-[#4A3525]">
              procure
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Nome do cliente ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
              />
              <Search className="absolute right-3 text-gray-600" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute -top-2.5 left-2 bg-[#EADCC8] px-1 text-[10px] font-bold uppercase tracking-wider text-[#4A3525]">
                STATUS
              </span>
              <div className="relative flex items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
                <ChevronDown className="absolute right-2.5 text-gray-600 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-2.5 left-2 bg-[#EADCC8] px-1 text-[10px] font-bold uppercase tracking-wider text-[#4A3525]">
                ORDENAR POR
              </span>
              <div className="relative flex items-center">
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
                >
                  <option value="vencimento">Vencimento</option>
                  <option value="valor">Maior Valor</option>
                  <option value="nome">Nome do Cliente</option>
                </select>
                <ChevronDown className="absolute right-2.5 text-gray-600 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SELEÇÃO EM MASSA */}
        <div className="bg-[#EADCC8] px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-[#3B2314] border border-[#D8C7B0]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-[#3B2314] accent-[#C85327]"
            />
            <span>Selecionar todos</span>
          </label>
          <span className="font-semibold text-gray-600">
            Exibindo {filteredList.length} de 2.948
          </span>
        </div>

        {/* LISTA */}
        <div className="flex flex-col gap-3">
          {filteredList.map((item) => (
            <FiadoCard
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              onToggleSelect={toggleSelectOne}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredList.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              Nenhum cliente encontrado com os filtros selecionados.
            </div>
          )}
        </div>

        {/* PAGINAÇÃO */}
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-2 flex items-center justify-center gap-2 shadow-sm my-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700 transition"
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, 4].map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 text-xs font-bold rounded-lg flex items-center justify-center transition ${
                currentPage === pageNum
                  ? 'bg-[#1F1712] text-white'
                  : 'hover:bg-[#EADCC8] text-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <span className="text-xs text-gray-500 px-1 font-mono">...</span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}