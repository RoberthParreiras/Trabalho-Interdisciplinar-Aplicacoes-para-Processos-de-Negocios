import { useState, useMemo, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { CategoriaCard } from "../components/CategoriaCard";

const API_URL = "http://localhost:3000";

const formularioInicial = {
  nome: "",
};

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const [formulario, setFormulario] = useState(formularioInicial);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  // =========================
  // BUSCAR CATEGORIAS
  // =========================

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const res = await fetch(`${API_URL}/categorias/`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Não foi possível carregar as categorias.");
      }

      const dadosCategorias = await res.json();

      setCategorias(dadosCategorias);
    } catch (error) {
      setErro(error.message || "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // =========================
  // FILTRO
  // =========================

  const categoriasFiltradas = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    if (!termo) return categorias;

    return categorias.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [categorias, searchTerm]);

  // =========================
  // ABRIR MODAL - CRIAÇÃO
  // =========================

  function abrirModalCriacao() {
    setModoEdicao(false);
    setCategoriaSelecionada(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  // =========================
  // ABRIR MODAL - EDIÇÃO
  // =========================

  function abrirModalEdicao(categoria) {
    setModoEdicao(true);
    setCategoriaSelecionada(categoria);

    setFormulario({
      nome: categoria.nome ?? "",
    });

    setErro("");
    setModalAberto(true);
  }

  // =========================
  // FECHAR MODAL
  // =========================

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setCategoriaSelecionada(null);
    setFormulario(formularioInicial);
    setErro("");
  }

  // =========================
  // ALTERAR INPUT
  // =========================

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================
  // CRIAR / EDITAR CATEGORIA
  // =========================

  async function salvarCategoria(event) {
    event.preventDefault();

    setErro("");

    if (!formulario.nome.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);

      const categoria = {
        nome: formulario.nome.trim(),
      };

      const url = modoEdicao
        ? `${API_URL}/categorias/${categoriaSelecionada.id}`
        : `${API_URL}/categorias/`;

      const res = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          modoEdicao
            ? { id: categoriaSelecionada.id, ...categoria }
            : categoria,
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível salvar a categoria.",
        );
      }

      await carregarDados();
      fecharModal();
    } catch (error) {
      setErro(error.message || "Erro ao salvar o categoria.");
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // ABRIR MODAL - EXCLUSÃO
  // =========================

  function abrirModalExclusao(categoria) {
    setCategoriaSelecionada(categoria);
    setErro("");
    setModalExcluir(true);
  }

  // =========================
  // FECHAR MODAL - EXCLUSÃO
  // =========================

  function fecharModalExclusao() {
    if (excluindo) return;

    setModalExcluir(false);
    setCategoriaSelecionada(null);
    setErro("");
  }

  // =========================
  // EXCLUIR CATEGORIA
  // =========================

  async function deletarCategoria() {
    if (!categoriaSelecionada) return;

    try {
      setExcluindo(true);
      setErro("");

      const res = await fetch(
        `${API_URL}/categorias/${categoriaSelecionada.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Não foi possível excluir a categoria.");
      }

      setCategorias((prev) =>
        prev.filter((item) => item.id !== categoriaSelecionada.id),
      );

      fecharModalExclusao();
    } catch (error) {
      setErro(error.message || "Erro ao excluir a categoria.");
    } finally {
      setExcluindo(false);
    }
  }

  // =========================
  // TELA
  // =========================

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* CABEÇALHO */}

      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
              Categorias
            </h1>

            <span className="text-sm font-semibold text-gray-600">
              / ({categorias.length})
            </span>
          </div>

          <p className="text-xs text-gray-600 mt-0.5">Criação de categorias</p>
        </div>

        <button
          type="button"
          onClick={abrirModalCriacao}
          className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          <span>Adicionar</span>
          <span>categoria</span>
        </button>
      </div>

      {/* PESQUISA */}

      <div className="relative">
        <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-mono rounded font-medium text-[#4A3525] z-10">
          procure
        </span>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Nome da categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 pr-10 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
          />

          <Search className="absolute right-3 text-gray-600" size={18} />
        </div>
      </div>

      {/* ERRO */}

      {erro && !modalAberto && !modalExcluir && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
          {erro}
        </div>
      )}

      {/* CARREGANDO */}

      {carregando ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-6 text-center text-sm text-gray-500">
          Carregando categorias...
        </div>
      ) : categoriasFiltradas.length === 0 ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-8 text-center">
          <p className="font-bold text-[#4A3525]">
            {searchTerm
              ? "Nenhuma categoria encontrada."
              : "Nenhuma categoria cadastrada."}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Use o botão Adicionar produto para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {categoriasFiltradas.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onEdit={abrirModalEdicao}
              onDelete={abrirModalExclusao}
            />
          ))}
        </div>
      )}

      {/* =========================
          MODAL DE CADASTRO / EDIÇÃO
      ========================= */}

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">
            {/* CABEÇALHO */}

            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>

                <h2 className="font-black text-lg">
                  {modoEdicao ? "Editar categoria" : "Nova categoria"}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                className="p-1.5 hover:bg-[#4A2D19] rounded-lg transition"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORMULÁRIO */}

            <form onSubmit={salvarCategoria} className="p-4 flex flex-col gap-4">
              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              {/* NOME */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Nome da categoria
                </label>

                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  placeholder="Nome da categoria"
                  autoFocus
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              {/* BOTÕES */}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#BFAFA0] text-[#4A3525] font-bold text-sm hover:bg-[#EADCC8] transition disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold text-sm transition disabled:opacity-50"
                >
                  {salvando
                    ? "Salvando..."
                    : modoEdicao
                      ? "Salvar alterações"
                      : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          MODAL DE EXCLUSÃO
      ========================= */}

      {modalExcluir && categoriaSelecionada && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">
            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>

                <h2 className="font-black text-lg">Excluir produto</h2>
              </div>

              <button
                type="button"
                onClick={fecharModalExclusao}
                disabled={excluindo}
                className="p-1.5 hover:bg-[#4A2D19] rounded-lg transition"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              <p className="text-sm text-[#4A3525]">
                Deseja realmente excluir o produto{" "}
                <strong>{categoriaSelecionada.nome}</strong>?
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fecharModalExclusao}
                  disabled={excluindo}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#BFAFA0] text-[#4A3525] font-bold text-sm hover:bg-[#EADCC8] transition disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={deletarCategoria}
                  disabled={excluindo}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-50"
                >
                  {excluindo ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
