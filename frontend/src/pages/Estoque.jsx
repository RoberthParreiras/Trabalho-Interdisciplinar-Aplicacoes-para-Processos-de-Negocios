
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { EstoqueCard } from "../components/EstoqueCard";

const API_URL = "http://localhost:3000";

const formularioInicial = {
  nome: "",
  quantidade: "",
  idCategoria: "",
  estoqueMinimo: "",
};

export default function Estoque() {
  const [estoques, setEstoques] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState(null);

  const [formulario, setFormulario] = useState(formularioInicial);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  // =========================
  // BUSCAR ESTOQUES E CATEGORIAS
  // =========================

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [resEstoques, resCategorias] = await Promise.all([
        fetch(`${API_URL}/estoques/`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/categorias/`, {
          credentials: "include",
        }),
      ]);

      if (!resEstoques.ok) {
        throw new Error("Não foi possível carregar os estoques.");
      }

      if (!resCategorias.ok) {
        throw new Error("Não foi possível carregar as categorias.");
      }

      const dadosEstoques = await resEstoques.json();
      const dadosCategorias = await resCategorias.json();

      setCategorias(dadosCategorias);

      const estoquesComCategorias = dadosEstoques.map((estoque) => ({
        ...estoque,
        categoria:
          dadosCategorias.find(
            (categoria) => categoria.id === estoque.idCategoria,
          )?.nome ?? "Sem categoria",
      }));

      setEstoques(estoquesComCategorias);
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

  const estoquesFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    if (!termo) return estoques;

    return estoques.filter((item) =>
      item.nome.toLowerCase().includes(termo),
    );
  }, [estoques, searchTerm]);

  // =========================
  // ABRIR MODAL - CRIAÇÃO
  // =========================

  function abrirModalCriacao() {
    setModoEdicao(false);
    setEstoqueSelecionado(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  // =========================
  // ABRIR MODAL - EDIÇÃO
  // =========================

  function abrirModalEdicao(estoque) {
    setModoEdicao(true);
    setEstoqueSelecionado(estoque);

    setFormulario({
      nome: estoque.nome ?? "",
      quantidade: estoque.quantidade ?? "",
      idCategoria: estoque.idCategoria ?? "",
      estoqueMinimo: estoque.estoqueMinimo ?? "",
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
    setEstoqueSelecionado(null);
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
  // CRIAR / EDITAR ESTOQUE
  // =========================

  async function salvarEstoque(event) {
    event.preventDefault();

    setErro("");

    if (
      !formulario.nome.trim() ||
      formulario.quantidade === "" ||
      !formulario.idCategoria ||
      formulario.estoqueMinimo === ""
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (
      Number(formulario.quantidade) < 0 ||
      Number(formulario.estoqueMinimo) < 0
    ) {
      setErro("As quantidades não podem ser negativas.");
      return;
    }

    try {
      setSalvando(true);

      const estoque = {
        nome: formulario.nome.trim(),
        quantidade: formulario.quantidade,
        idCategoria: formulario.idCategoria,
        estoqueMinimo: formulario.estoqueMinimo,
      };

      const url = modoEdicao
        ? `${API_URL}/estoques/${estoqueSelecionado.id}`
        : `${API_URL}/estoques/`;

      const res = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          modoEdicao
            ? { id: estoqueSelecionado.id, ...estoque }
            : estoque,
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível salvar o estoque.",
        );
      }

      await carregarDados();
      fecharModal();
    } catch (error) {
      setErro(error.message || "Erro ao salvar o estoque.");
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // ABRIR MODAL - EXCLUSÃO
  // =========================

  function abrirModalExclusao(estoque) {
    setEstoqueSelecionado(estoque);
    setErro("");
    setModalExcluir(true);
  }

  // =========================
  // FECHAR MODAL - EXCLUSÃO
  // =========================

  function fecharModalExclusao() {
    if (excluindo) return;

    setModalExcluir(false);
    setEstoqueSelecionado(null);
    setErro("");
  }

  // =========================
  // EXCLUIR ESTOQUE
  // =========================

  async function deletarEstoque() {
    if (!estoqueSelecionado) return;

    try {
      setExcluindo(true);
      setErro("");

      const res = await fetch(
        `${API_URL}/estoques/${estoqueSelecionado.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível excluir o estoque.",
        );
      }

      setEstoques((prev) =>
        prev.filter((item) => item.id !== estoqueSelecionado.id),
      );

      fecharModalExclusao();
    } catch (error) {
      setErro(error.message || "Erro ao excluir o estoque.");
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
              Inventário
            </h1>

            <span className="text-sm font-semibold text-gray-600">
              / ({estoques.length})
            </span>
          </div>

          <p className="text-xs text-gray-600 mt-0.5">
            Gestão de contas e recebimentos
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCriacao}
          className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          <span>Adicionar</span>
          <span>produto</span>
        </button>
      </div>

      {/* PESQUISA */}

      <div className="relative">
        <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-mono font-medium text-[#4A3525] z-10">
          procure
        </span>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 pr-10 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
          />

          <Search
            className="absolute right-3 text-gray-600"
            size={18}
          />
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
          Carregando estoques...
        </div>
      ) : estoquesFiltrados.length === 0 ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-8 text-center">
          <p className="font-bold text-[#4A3525]">
            {searchTerm
              ? "Nenhum produto encontrado."
              : "Nenhum produto cadastrado."}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Use o botão Adicionar produto para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {estoquesFiltrados.map((estoque) => (
            <EstoqueCard
              key={estoque.id}
              estoque={estoque}
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
                  {modoEdicao ? "Editar produto" : "Novo produto"}
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

            <form
              onSubmit={salvarEstoque}
              className="p-4 flex flex-col gap-4"
            >
              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              {/* NOME */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Nome do produto
                </label>

                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  placeholder="Nome do produto"
                  autoFocus
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              {/* QUANTIDADE */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Quantidade em estoque
                </label>

                <input
                  type="number"
                  name="quantidade"
                  min="0"
                  value={formulario.quantidade}
                  onChange={alterarCampo}
                  placeholder="Quantidade"
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              {/* CATEGORIA */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Categoria
                </label>

                <select
                  name="idCategoria"
                  value={formulario.idCategoria}
                  onChange={alterarCampo}
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                >
                  <option value="">Selecione uma categoria</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* ESTOQUE MÍNIMO */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Estoque mínimo
                </label>

                <input
                  type="number"
                  name="estoqueMinimo"
                  min="0"
                  value={formulario.estoqueMinimo}
                  onChange={alterarCampo}
                  placeholder="Estoque mínimo"
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

      {modalExcluir && estoqueSelecionado && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">

            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>

                <h2 className="font-black text-lg">
                  Excluir produto
                </h2>
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
                <strong>{estoqueSelecionado.nome}</strong>?
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
                  onClick={deletarEstoque}
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
