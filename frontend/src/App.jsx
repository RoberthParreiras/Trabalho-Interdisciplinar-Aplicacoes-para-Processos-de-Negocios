// import React, { useState, useMemo } from 'react';
// import { 
//   Menu, 
//   Plus, 
//   Search, 
//   ChevronDown, 
//   ChevronLeft, 
//   ChevronRight, 
//   Boxes, 
//   ClipboardList, 
//   Users, 
//   CircleDollarSign 
// } from 'lucide-react';
// import { ProductCard } from './components/ProductCard';
// import { INITIAL_PRODUCTS } from './data/mockProducts';

// export default function App() {
//   const [products, setProducts] = useState(INITIAL_PRODUCTS);
//   const [activeTab, setActiveTab] = useState('estoque');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('todas');
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Filtragem dinâmica por termo e categoria
//   const filteredProducts = useMemo(() => {
//     return products.filter((item) => {
//       const matchSearch =
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.code.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchCategory =
//         selectedCategory === 'todas' || item.category === selectedCategory;
//       return matchSearch && matchCategory;
//     });
//   }, [products, searchTerm, selectedCategory]);

//   const allSelected =
//     filteredProducts.length > 0 &&
//     filteredProducts.every((p) => selectedIds.includes(p.id));

//   const toggleSelectAll = () => {
//     if (allSelected) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredProducts.map((p) => p.id));
//     }
//   };

//   const toggleSelectOne = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Deseja realmente remover este item?')) {
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       setSelectedIds((prev) => prev.filter((item) => item !== id));
//     }
//   };

//   const handleEdit = (product) => {
//     alert(`Editar produto: ${product.name} (${product.code})`);
//   };

//   const handleAddProduct = () => {
//     const name = window.prompt('Nome do produto:');
//     if (!name) return;
//     const priceStr = window.prompt('Preço (ex: 15.50):') || '0';
//     const qtdStr = window.prompt('Quantidade:') || '1';

//     const newProd = {
//       id: Date.now().toString(),
//       code: `0X${Math.floor(Math.random() * 0xfffff).toString(16).toUpperCase()}`,
//       name,
//       category: 'bebida',
//       price: parseFloat(priceStr) || 0,
//       quantity: parseInt(qtdStr, 10) || 1,
//       unit: 'un',
//     };

//     setProducts((prev) => [newProd, ...prev]);
//   };

//   const tabs = [
//     { id: 'estoque', label: 'Gestão Estoque' },
//     { id: 'pedidos', label: 'Pedidos' },
//     { id: 'usuarios', label: 'Usuários' },
//     { id: 'fiado', label: 'Fiado' },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F5EBD7] text-[#2A1A0F] flex flex-col font-sans pb-24">
//       {/* HEADER SUPERIOR */}
//       <header className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
//         <div className="flex items-center gap-3">
//           <button className="p-1 hover:opacity-80 transition" aria-label="Menu" type="button">
//             <Menu size={24} />
//           </button>
//           <div className="leading-none">
//             <span className="text-[10px] font-bold tracking-widest text-[#F39C12] block">SGB</span>
//             <span className="text-xl font-black tracking-tight text-[#E67E22] drop-shadow-sm">
//               MAGAIVER
//             </span>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={handleAddProduct}
//           className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow transition"
//         >
//           <Plus size={18} strokeWidth={2.5} />
//           <span>adicionar</span>
//         </button>
//       </header>

//       {/* ABAS RÁPIDAS */}
//       <div className="bg-[#EADCC8] px-3 py-2 flex items-center gap-2 overflow-x-auto border-b border-[#D8C7B0]">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             type="button"
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
//               activeTab === tab.id
//                 ? 'bg-[#C85327] text-white shadow-sm'
//                 : 'bg-[#FCF8F2] text-[#4A3525] border border-[#D8C7B0]'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONTEÚDO PRINCIPAL */}
//       <main className="p-4 max-w-lg mx-auto w-full flex-1 flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-baseline gap-2">
//             <h1 className="text-xl font-black tracking-tight text-[#1F1712]">INVENTARIO</h1>
//             <span className="text-sm font-semibold text-gray-600">/ ({products.length})</span>
//           </div>
//           <div className="bg-[#EADCC8] text-[#3B2314] text-xs font-semibold px-3 py-1 rounded-md border border-[#D8C7B0]">
//             Total: {products.length} itens
//           </div>
//         </div>

//         {/* BUSCA E FILTRO */}
//         <div className="flex flex-col gap-3">
//           <div className="relative">
//             <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">
//               procure
//             </span>
//             <div className="relative flex items-center">
//               <input
//                 type="text"
//                 placeholder="Nome ou código..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-lg px-3 py-2 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
//               />
//               <Search className="absolute right-3 text-gray-600" size={18} />
//             </div>
//           </div>

//           <div className="relative">
//             <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">
//               pesquise categoria
//             </span>
//             <div className="relative flex items-center">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-lg px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
//               >
//                 <option value="todas">Todas as categorias</option>
//                 <option value="bebida">bebida</option>
//                 <option value="petisco">petisco</option>
//                 <option value="alimento">alimento</option>
//                 <option value="outros">outros</option>
//               </select>
//               <ChevronDown className="absolute right-3 text-gray-600 pointer-events-none" size={18} />
//             </div>
//           </div>
//         </div>

//         {/* SELEÇÃO EM MASSA */}
//         <div className="bg-[#EADCC8] px-3 py-2 rounded-lg flex items-center justify-between text-xs font-bold text-[#3B2314] border border-[#D8C7B0]">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={allSelected}
//               onChange={toggleSelectAll}
//               className="w-4 h-4 rounded border-[#3B2314] accent-[#C85327]"
//             />
//             <span>Selecionar Todos</span>
//           </label>
//           <span className="font-semibold text-gray-600">
//             Exibindo {filteredProducts.length} de {products.length}
//           </span>
//         </div>

//         {/* LISTA */}
//         <div className="flex flex-col gap-3">
//           {filteredProducts.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               selected={selectedIds.includes(product.id)}
//               onToggleSelect={toggleSelectOne}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}

//           {filteredProducts.length === 0 && (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Nenhum produto encontrado.
//             </div>
//           )}
//         </div>

//         {/* PAGINAÇÃO */}
//         <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-2 flex items-center justify-center gap-2 shadow-sm my-2">
//           <button
//             type="button"
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           {[1, 2, 3, 4, 5].map((pageNum) => (
//             <button
//               key={pageNum}
//               type="button"
//               onClick={() => setCurrentPage(pageNum)}
//               className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition ${
//                 currentPage === pageNum
//                   ? 'bg-[#1F1712] text-white'
//                   : 'hover:bg-[#EADCC8] text-gray-700'
//               }`}
//             >
//               {pageNum}
//             </button>
//           ))}
//           <span className="text-xs text-gray-500 px-1">...</span>
//           <button
//             type="button"
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </main>

//       {/* FOOTER NAVEGAÇÃO FIXA */}
//       <footer className="fixed bottom-0 left-0 right-0 bg-[#2E1A0F] text-[#EADCC8] py-2 px-6 flex items-center justify-around border-t border-[#4A2D19] z-30 shadow-lg">
//         <button
//           type="button"
//           onClick={() => setActiveTab('estoque')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'estoque' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <Boxes size={20} />
//           <span>Estoque</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('pedidos')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'pedidos' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <ClipboardList size={20} />
//           <span>Pedidos</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('usuarios')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'usuarios' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <Users size={20} />
//           <span>Usuários</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('fiado')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'fiado' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <CircleDollarSign size={20} />
//           <span>Fiado</span>
//         </button>
//       </footer>
//     </div>
//   );
// }

// import React, { useState, useMemo } from 'react';
// import {
//   Bell,
//   Search,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Boxes,
//   ClipboardList,
//   Users,
//   CircleDollarSign,
//   BookOpen,
// } from 'lucide-react';
// import { FiadoCard } from './components/FiadoCard';
// import { INITIAL_FIADO } from './data/mockFiado';

// export default function App() {
//   const [fiadoList, setFiadoList] = useState(INITIAL_FIADO);
//   const [activeTab, setActiveTab] = useState('fiado');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('todos');
//   const [orderBy, setOrderBy] = useState('vencimento');
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Filtros dinâmicos e ordenação
//   const filteredList = useMemo(() => {
//     let list = fiadoList.filter((item) => {
//       const matchSearch =
//         item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.code.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchStatus =
//         statusFilter === 'todos' || item.status === statusFilter;
//       return matchSearch && matchStatus;
//     });

//     if (orderBy === 'vencimento') {
//       list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
//     } else if (orderBy === 'valor') {
//       list.sort((a, b) => b.totalDue - a.totalDue);
//     } else if (orderBy === 'nome') {
//       list.sort((a, b) => a.clientName.localeCompare(b.clientName));
//     }

//     return list;
//   }, [fiadoList, searchTerm, statusFilter, orderBy]);

//   const allSelected =
//     filteredList.length > 0 &&
//     filteredList.every((item) => selectedIds.includes(item.id));

//   const toggleSelectAll = () => {
//     if (allSelected) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredList.map((item) => item.id));
//     }
//   };

//   const toggleSelectOne = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Deseja quitar ou remover este registro de fiado?')) {
//       setFiadoList((prev) => prev.filter((item) => item.id !== id));
//       setSelectedIds((prev) => prev.filter((item) => item !== id));
//     }
//   };

//   const handleEdit = (item) => {
//     const newName = window.prompt('Editar nome do cliente:', item.clientName);
//     if (!newName) return;
//     const newTotal = parseFloat(
//       window.prompt('Total devido (R$):', item.totalDue.toString()) || item.totalDue
//     );

//     setFiadoList((prev) =>
//       prev.map((it) =>
//         it.id === item.id ? { ...it, clientName: newName, totalDue: newTotal } : it
//       )
//     );
//   };

//   const handleAddClient = () => {
//     const clientName = window.prompt('Nome do cliente:');
//     if (!clientName) return;
//     const totalDue = parseFloat(window.prompt('Total devido (ex: 160.00):') || '0');
//     const dueDate = window.prompt('Data de vencimento (ex: 10/11):') || '10/11';

//     const newItem = {
//       id: Date.now().toString(),
//       code: `#00${Math.floor(100 + Math.random() * 900)}`,
//       clientName,
//       totalDue: totalDue || 0,
//       dueDate,
//       status: 'pendente',
//     };

//     setFiadoList((prev) => [newItem, ...prev]);
//   };

//   const topTabs = [
//     { id: 'estoque', label: 'Gestão Estoque' },
//     { id: 'pedidos', label: 'Pedidos' },
//     { id: 'usuarios', label: 'Controle Usuários' },
//     { id: 'fiado', label: 'Controle Fiado' },
//     { id: 'cardapio', label: 'Controle Cardápio' },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F5EBD7] text-[#2A1A0F] flex flex-col font-sans pb-24">
//       {/* HEADER SUPERIOR */}
//       <header className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
//         <div className="leading-none">
//           <span className="text-[10px] font-bold tracking-widest text-[#E67E22] block uppercase">
//             SGB
//           </span>
//           <span className="text-xl font-black tracking-tight text-[#E67E22] drop-shadow-sm uppercase">
//             MAGAIVER
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             className="w-9 h-9 rounded-full bg-[#3F2618] flex items-center justify-center text-[#EADCC8] hover:opacity-90 transition"
//             aria-label="Notificações"
//           >
//             <Bell size={18} />
//           </button>
//           <div className="w-9 h-9 rounded-full bg-[#C85327] flex items-center justify-center text-white font-bold text-xs shadow-sm">
//             AD
//           </div>
//         </div>
//       </header>

//       {/* ABAS RÁPIDAS */}
//       <div className="bg-[#EADCC8] px-3 py-2 flex items-center gap-2 overflow-x-auto border-b border-[#D8C7B0] no-scrollbar">
//         {topTabs.map((tab) => (
//           <button
//             key={tab.id}
//             type="button"
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
//               activeTab === tab.id
//                 ? 'bg-[#C85327] text-white shadow-sm'
//                 : 'bg-[#FCF8F2] text-[#4A3525] border border-[#D8C7B0]'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONTEÚDO */}
//       <main className="p-4 max-w-lg mx-auto w-full flex-1 flex flex-col gap-4">
//         {/* TÍTULO E BOTÃO ADICIONAR */}
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <div className="flex items-baseline gap-2">
//               <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
//                 Controle Fiado
//               </h1>
//               <span className="text-sm font-semibold text-gray-600 font-mono">
//                 / (2948)
//               </span>
//             </div>
//             <p className="text-xs text-gray-600 mt-0.5">
//               Gestão de contas e recebimentos
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={handleAddClient}
//             className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
//           >
//             <span>Adicionar</span>
//             <span>Cliente</span>
//           </button>
//         </div>

//         {/* FILTROS E BUSCA */}
//         <div className="bg-[#EADCC8] p-3 rounded-2xl border border-[#D8C7B0] flex flex-col gap-3">
//           <div className="relative">
//             <span className="absolute -top-2.5 left-3 bg-[#EADCC8] px-1.5 text-xs font-mono font-medium text-[#4A3525]">
//               procure
//             </span>
//             <div className="relative flex items-center">
//               <input
//                 type="text"
//                 placeholder="Nome do cliente ou documento..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
//               />
//               <Search className="absolute right-3 text-gray-600" size={18} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div className="relative">
//               <span className="absolute -top-2.5 left-2 bg-[#EADCC8] px-1 text-[10px] font-bold uppercase tracking-wider text-[#4A3525]">
//                 STATUS
//               </span>
//               <div className="relative flex items-center">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
//                 >
//                   <option value="todos">Todos</option>
//                   <option value="atrasado">Atrasado</option>
//                   <option value="pendente">Pendente</option>
//                   <option value="pago">Pago</option>
//                 </select>
//                 <ChevronDown className="absolute right-2.5 text-gray-600 pointer-events-none" size={16} />
//               </div>
//             </div>

//             <div className="relative">
//               <span className="absolute -top-2.5 left-2 bg-[#EADCC8] px-1 text-[10px] font-bold uppercase tracking-wider text-[#4A3525]">
//                 ORDENAR POR
//               </span>
//               <div className="relative flex items-center">
//                 <select
//                   value={orderBy}
//                   onChange={(e) => setOrderBy(e.target.value)}
//                   className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
//                 >
//                   <option value="vencimento">Vencimento</option>
//                   <option value="valor">Maior Valor</option>
//                   <option value="nome">Nome do Cliente</option>
//                 </select>
//                 <ChevronDown className="absolute right-2.5 text-gray-600 pointer-events-none" size={16} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SELEÇÃO EM MASSA */}
//         <div className="bg-[#EADCC8] px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-[#3B2314] border border-[#D8C7B0]">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={allSelected}
//               onChange={toggleSelectAll}
//               className="w-4 h-4 rounded border-[#3B2314] accent-[#C85327]"
//             />
//             <span>Selecionar todos</span>
//           </label>
//           <span className="font-semibold text-gray-600">
//             Exibindo {filteredList.length} de 2.948
//           </span>
//         </div>

//         {/* LISTA */}
//         <div className="flex flex-col gap-3">
//           {filteredList.map((item) => (
//             <FiadoCard
//               key={item.id}
//               item={item}
//               selected={selectedIds.includes(item.id)}
//               onToggleSelect={toggleSelectOne}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}

//           {filteredList.length === 0 && (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Nenhum cliente encontrado com os filtros selecionados.
//             </div>
//           )}
//         </div>

//         {/* PAGINAÇÃO */}
//         <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-2 flex items-center justify-center gap-2 shadow-sm my-2">
//           <button
//             type="button"
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700 transition"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           {[1, 2, 3, 4].map((pageNum) => (
//             <button
//               key={pageNum}
//               type="button"
//               onClick={() => setCurrentPage(pageNum)}
//               className={`w-7 h-7 text-xs font-bold rounded-lg flex items-center justify-center transition ${
//                 currentPage === pageNum
//                   ? 'bg-[#1F1712] text-white'
//                   : 'hover:bg-[#EADCC8] text-gray-700'
//               }`}
//             >
//               {pageNum}
//             </button>
//           ))}
//           <span className="text-xs text-gray-500 px-1 font-mono">...</span>
//           <button
//             type="button"
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700 transition"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="fixed bottom-0 left-0 right-0 bg-[#2E1A0F] text-[#EADCC8] py-2 px-6 flex items-center justify-around border-t border-[#4A2D19] z-30 shadow-lg">
//         <button
//           type="button"
//           onClick={() => setActiveTab('estoque')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'estoque' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <Boxes size={20} />
//           <span>Estoque</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('pedidos')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'pedidos' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <ClipboardList size={20} />
//           <span>Pedidos</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('usuarios')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'usuarios' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <Users size={20} />
//           <span>Usuários</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('fiado')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'fiado' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <div className="p-1.5 bg-[#4A2D19] rounded-xl text-[#E67E22]">
//             <CircleDollarSign size={20} />
//           </div>
//           <span className="text-[#E67E22]">Fiado</span>
//         </button>
//         <button
//           type="button"
//           onClick={() => setActiveTab('cardapio')}
//           className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
//             activeTab === 'cardapio' ? 'text-[#E67E22]' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <BookOpen size={20} />
//           <span>Cardápio</span>
//         </button>
//       </footer>
//     </div>
//   );
// }

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