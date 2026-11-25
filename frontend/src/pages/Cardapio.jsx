import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { CardapioCard } from "../components/CardapioCard";

const API_URL = "http://localhost:3000";

const formularioInicial = {
  nome: "",
  preco: "",
  disponivel: true,
};

export default function Cardapio() {
  const [cardapios, setCardapios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarCardapios() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/cardapios/`, {
        credentials: "include",
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar o cardápio.");
      }

      setCardapios(await resposta.json());
    } catch (error) {
      setErro(error.message || "Erro ao carregar o cardápio.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCardapios();
  }, []);

  const cardapiosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    if (!termo) return cardapios;

    return cardapios.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [cardapios, searchTerm]);

  function abrirModalCriacao() {
    setModoEdicao(false);
    setItemSelecionado(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  function abrirModalEdicao(item) {
    setModoEdicao(true);
    setItemSelecionado(item);
    setFormulario({
      nome: item.nome ?? "",
      preco: Number(item.preco).toFixed(2),
      disponivel: item.disponivel,
    });
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setItemSelecionado(null);
    setFormulario(formularioInicial);
    setErro("");
  }

  function alterarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarItem(event) {
    event.preventDefault();
    setErro("");

    const nome = formulario.nome.trim();
    const preco = formulario.preco.trim().replace(",", ".");

    if (!nome || !preco) {
      setErro("Preencha o nome e o preço do item.");
      return;
    }

    if (!/^\d+(?:\.\d{1,2})?$/.test(preco)) {
      setErro("Informe um preço válido com até duas casas decimais.");
      return;
    }

    try {
      setSalvando(true);

      const resposta = await fetch(
        modoEdicao
          ? `${API_URL}/cardapios/${itemSelecionado.id}`
          : `${API_URL}/cardapios/`,
        {
          method: modoEdicao ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nome,
            preco,
            disponivel: formulario.disponivel,
          }),
        },
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível salvar o item.");
      }

      await carregarCardapios();
      setModalAberto(false);
      setItemSelecionado(null);
      setFormulario(formularioInicial);
      setErro("");
    } catch (error) {
      setErro(error.message || "Erro ao salvar o item.");
    } finally {
      setSalvando(false);
    }
  }

  function abrirModalExclusao(item) {
    setItemSelecionado(item);
    setErro("");
    setModalExcluir(true);
  }

  function fecharModalExclusao() {
    if (excluindo) return;

    setModalExcluir(false);
    setItemSelecionado(null);
    setErro("");
  }

  async function deletarItem() {
    if (!itemSelecionado) return;

    try {
      setExcluindo(true);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/cardapios/${itemSelecionado.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível excluir o item.");
      }

      setCardapios((atuais) =>
        atuais.filter((item) => item.id !== itemSelecionado.id),
      );
      setModalExcluir(false);
      setItemSelecionado(null);
      setErro("");
    } catch (error) {
      setErro(error.message || "Erro ao excluir o item.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
              Cardápio
            </h1>
            <span className="text-sm font-semibold text-gray-600">
              / ({cardapios.length})
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Gestão de itens, preços e disponibilidade
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCriacao}
          className="bg-[#8AA639] hover:bg-[#78932F] text-[#1E2E06] font-bold px-4 py-2 rounded-xl text-xs flex flex-col items-center justify-center leading-tight shadow transition active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          <span>Adicionar</span>
          <span>item</span>
        </button>
      </div>

      <div className="relative">
        <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-mono rounded font-medium text-[#4A3525] z-10">
          procure
        </span>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Nome do item..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 pr-10 text-sm text-[#1F1712] focus:outline-none focus:ring-2 focus:ring-[#C85327] placeholder-gray-500"
          />
          <Search className="absolute right-3 text-gray-600" size={18} />
        </div>
      </div>

      {erro && !modalAberto && !modalExcluir && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-6 text-center text-sm text-gray-500">
          Carregando cardápio...
        </div>
      ) : cardapiosFiltrados.length === 0 ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-8 text-center">
          <p className="font-bold text-[#4A3525]">
            {searchTerm
              ? "Nenhum item encontrado."
              : "Nenhum item cadastrado no cardápio."}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Use o botão Adicionar item para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cardapiosFiltrados.map((item) => (
            <CardapioCard
              key={item.id}
              item={item}
              onEdit={abrirModalEdicao}
              onDelete={abrirModalExclusao}
            />
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">
            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>
                <h2 className="font-black text-lg">
                  {modoEdicao ? "Editar item" : "Novo item"}
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

            <form onSubmit={salvarItem} className="p-4 flex flex-col gap-4">
              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              <div>
                <label
                  htmlFor="cardapio-nome"
                  className="block text-xs font-bold text-[#4A3525] mb-1"
                >
                  Nome do item
                </label>
                <input
                  id="cardapio-nome"
                  name="nome"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  placeholder="Ex.: Suco natural"
                  required
                  autoFocus
                  disabled={salvando}
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              <div>
                <label
                  htmlFor="cardapio-preco"
                  className="block text-xs font-bold text-[#4A3525] mb-1"
                >
                  Preço (R$)
                </label>
                <input
                  id="cardapio-preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.preco}
                  onChange={alterarCampo}
                  placeholder="0,00"
                  required
                  disabled={salvando}
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-[#4A3525]">
                <input
                  type="checkbox"
                  checked={formulario.disponivel}
                  onChange={(event) =>
                    setFormulario((atual) => ({
                      ...atual,
                      disponivel: event.target.checked,
                    }))
                  }
                  disabled={salvando}
                  className="h-4 w-4 accent-[#8AA639]"
                />
                Disponível para venda
              </label>

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

      {modalExcluir && itemSelecionado && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">
            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>
                <h2 className="font-black text-lg">Excluir item</h2>
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
                Deseja realmente excluir <strong>{itemSelecionado.nome}</strong>{" "}
                do cardápio?
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
                  onClick={deletarItem}
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
