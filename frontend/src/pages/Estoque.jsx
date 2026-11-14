import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { EstoqueCard } from "../components/EstoqueCard";
import { INITIAL_PRODUCTS } from "../data/mockProducts";

export default function Estoque() {
  async function getEstoques() {
    const dataEstoques = await fetch("http://localhost:3000/estoques/");

    if (!dataEstoques.ok) return "Não foi possível carregar os estoques";

    const dataCategorias = await fetch("http://localhost:3000/categorias/");

    if (!dataCategorias.ok) console.log("Erro ao carregar categorias");

    const estoques = await dataEstoques.json();
    const categorias = await dataCategorias.json();

    const estoquesComCategorias = estoques.map((estoque) => ({
      ...estoque,
      categoria:
        categorias.find((categoria) => categoria.id === estoque.idCategoria)
          .nome ?? "Sem categoria",
    }));

    return estoquesComCategorias;
  }

  async function criarEstoque(novoEstoque) {
    const res = await fetch("http://localhost:3000/estoques/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoEstoque),
    });

    const data = await res.json();
    window.alert(data.mensagem);
  }

  async function editarEstoque(estoqueParaEditar) {
    const res = await fetch(
      `http://localhost:3000/estoques/${estoqueParaEditar.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estoqueParaEditar),
      },
    );

    const data = await res.json();
    window.alert(data.mensagem);
  }

  async function deletarEstoque(estoqueParaDeletar) {
    const res = await fetch(
      `http://localhost:3000/estoques/${estoqueParaDeletar.id}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();
    window.alert(data.mensagem);
  }

  const [estoques, setEstoques] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function renderEstoques() {
      try {
        const data = await getEstoques();
        setEstoques(data);
      } catch (e) {
        console.log(e);
      }
    }

    renderEstoques();
  }, [criarEstoque, editarEstoque, deletarEstoque]);

  // const filteredProducts = useMemo(() => {
  //   return products.filter((item) => {
  //     const matchSearch =
  //       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.cpf.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchCategory =
  //       selectedCategory === "todas" || item.category === selectedCategory;
  //     return matchSearch && matchCategory;
  //   });
  // }, [products, searchTerm, selectedCategory]);

  // const allSelected =
  //   filteredProducts.length > 0 &&
  //   filteredProducts.every((p) => selectedIds.includes(p.id));

  // const toggleSelectAll = () => {
  //   if (allSelected) setSelectedIds([]);
  //   else setSelectedIds(filteredProducts.map((p) => p.id));
  // };

  // const toggleSelectOne = (id) => {
  //   setSelectedIds((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
  //   );
  // };

  const handleDelete = (item) => {
    if (window.confirm("Deseja remover este registro de estoque?")) {
      deletarEstoque(item);
    }
  };

  const handleEdit = (item) => {
    const novoNome = window.prompt("Editar o nome do produto:", item.nome);
    if (!novoNome) return;
    const novaQuantidade = window.prompt(
      "Editar quantidade para estoque:",
      item.quantidade,
    );
    if (!novaQuantidade) return;
    const idCategoria = window.prompt("Id da categoria:", item.idCategoria);
    if (!idCategoria) return;
    const NovoEstoqueMinimo = window.prompt(
      "Editar estoque mínimo:",
      item.estoqueMinimo,
    );
    if (!NovoEstoqueMinimo) return;

    const estoqueParaEditar = {
      id: item.id,
      nome: novoNome,
      quantidade: novaQuantidade,
      idCategoria,
      estoqueMinimo: NovoEstoqueMinimo,
    };

    editarEstoque(estoqueParaEditar);
  };

  const handleAddProduct = () => {
    const nome = window.prompt("Nome do produto:");
    if (!nome) return;
    const quantidade = window.prompt("Quantidade para estoque:");
    if (!quantidade) return;
    const idCategoria = window.prompt("Id da categoria:");
    if (!idCategoria) return;
    const estoqueMinimo = window.prompt("Estoque mínimo:");
    if (!estoqueMinimo) return;

    const novoEstoque = {
      nome,
      quantidade,
      idCategoria,
      estoqueMinimo,
    };

    criarEstoque(novoEstoque);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
              Inventário
            </h1>
            <span className="text-sm font-semibold text-gray-600">
              / ({estoques?.length})
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Gestão de contas e recebimentos
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
        >
          <span>Adicionar</span>
          <span>produto</span>
        </button>
      </div>

      {/* <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">
            procure
          </span>
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
          <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-bold text-[#4A3525]">
            pesquise categoria
          </span>
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
            <ChevronDown
              className="absolute right-3 text-gray-600 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div> */}

      {/* <div className="bg-[#EADCC8] px-3 py-2 rounded-lg flex items-center justify-between text-xs font-bold text-[#3B2314] border border-[#D8C7B0]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-[#3B2314] accent-[#C85327]"
          />
          <span>Selecionar Todos</span>
        </label>
        <span className="font-semibold text-gray-600">
          Exibindo {estoques?.length} de {estoques?.length}
        </span>
      </div> */}

      <div className="flex flex-col gap-3">
        {estoques?.map((estoque) => (
          <EstoqueCard
            key={estoque.id}
            estoque={estoque}
            // selected={selectedIds.includes(estoque.id)}
            // onToggleSelect={toggleSelectOne}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {estoques?.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      {/* <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-2 flex items-center justify-center gap-2 shadow-sm my-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700"
        >
          <ChevronLeft size={16} />
        </button>
        {[1, 2, 3, 4, 5].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition ${currentPage === pageNum ? "bg-[#1F1712] text-white" : "hover:bg-[#EADCC8] text-gray-700"}`}
          >
            {pageNum}
          </button>
        ))}
        <span className="text-xs text-gray-500 px-1">...</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-1.5 rounded hover:bg-[#EADCC8] text-gray-700"
        >
          <ChevronRight size={16} />
        </button>
      </div> */}
    </div>
  );
}
