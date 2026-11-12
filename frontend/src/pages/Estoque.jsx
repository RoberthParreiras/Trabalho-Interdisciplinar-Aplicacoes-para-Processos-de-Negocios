import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

export default function Estoque() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'todas' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map((p) => p.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente remover este item?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleEdit = (product) => {
    alert(`Editar produto: ${product.name} (${product.code})`);
  };

  const handleAddProduct = () => {
    const name = window.prompt('Nome do produto:');
    if (!name) return;
    const priceStr = window.prompt('Preço (ex: 15.50):') || '0';
    const qtdStr = window.prompt('Quantidade:') || '1';

    const newProd = {
      id: Date.now().toString(),
      code: `0X${Math.floor(Math.random() * 0xfffff).toString(16).toUpperCase()}`,
      name,
      category: 'bebida',
      price: parseFloat(priceStr) || 0,
      quantity: parseInt(qtdStr, 10) || 1,
      unit: 'un',
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-black tracking-tight text-[#1F1712]">INVENTÁRIO</h1>
          <span className="text-sm font-semibold text-gray-600">/ ({products.length})</span>
        </div>
        
        {/* Temporary Add Button (since the header is in the layout) */}
        <button onClick={handleAddProduct} className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow transition">
          <Plus size={16} strokeWidth={2.5} /> adicionar
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">procure</span>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-lg px-3 py-2 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
            />
            <Search className="absolute right-3 text-gray-600" size={18} />
          </div>
        </div>

        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">pesquise categoria</span>
          <div className="relative flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#E3D6C3] border border-[#BFAFA0] rounded-lg px-3 py-2 text-sm text-[#1F1712] font-medium focus:outline-none focus:ring-2 focus:ring-[#C85327] cursor-pointer"
            >
              <option value="todas">Todas as categorias</option>
              <option value="bebida">bebida</option>
              <option value="petisco">petisco</option>
              <option value="alimento">alimento</option>
              <option value="outros">outros</option>
            </select>
            <ChevronDown className="absolute right-3 text-gray-600 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="bg-[#EADCC8] px-3 py-2 rounded-lg flex items-center justify-between text-xs font-bold text-[#3B2314] border border-[#D8C7B0]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-[#3B2314] accent-[#C85327]" />
          <span>Selecionar Todos</span>
        </label>
        <span className="font-semibold text-gray-600">
          Exibindo {filteredProducts.length} de {products.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} selected={selectedIds.includes(product.id)} onToggleSelect={toggleSelectOne} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">Nenhum produto encontrado.</div>
        )}
      </div>

      <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-2 flex items-center justify-center gap-2 shadow-sm my-2">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700">
          <ChevronLeft size={16} />
        </button>
        {[1, 2, 3, 4, 5].map((pageNum) => (
          <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition ${currentPage === pageNum ? 'bg-[#1F1712] text-white' : 'hover:bg-[#EADCC8] text-gray-700'}`}>
            {pageNum}
          </button>
        ))}
        <span className="text-xs text-gray-500 px-1">...</span>
        <button onClick={() => setCurrentPage((p) => p + 1)} className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}