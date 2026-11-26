import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { ItemComandaCard } from "../components/ItemComandaCard";

const API_URL = "http://localhost:3000";

const formularioInicial = {
  idComanda: "",
  idCardapio: "",
  quantidade: "",
  precoUnitario: "",
};

export default function ItensComanda() {
  const [itens, setItens] = useState([]);
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

  async function carregarItens() {
    try {
      setCarregando(true);
      setErro("");

      const res = await fetch(`${API_URL}/itens-comanda/`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Não foi possível carregar os itens da comanda.");
      }

      setItens(data);
    } catch (error) {
      setErro(error.message || "Erro ao carregar os itens da comanda.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarItens();
  }, []);

  const itensFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    if (!termo) return itens;

    return itens.filter((item) =>
      item.idComanda?.toLowerCase().includes(termo) ||
      item.idCardapio?.toLowerCase().includes(termo)
    );
  }, [itens, searchTerm]);

  const valorTotal = useMemo(
    () => itens.reduce(
      (total, item) => total + (Number(item.quantidade) * Number(item.precoUnitario)),
      0,
    ),
    [itens],
  );

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
      idComanda: item.idComanda ?? "",
      idCardapio: item.idCardapio ?? "",
      quantidade: item.quantidade ?? "",
      precoUnitario: item.precoUnitario ?? "",
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
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarItem(event) {
    event.preventDefault();
    setErro("");

    if (
      !formulario.idComanda.trim() ||
      !formulario.idCardapio.trim() ||
      formulario.quantidade === "" ||
      formulario.precoUnitario === ""
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!Number.isInteger(Number(formulario.quantidade)) || Number(formulario.quantidade) <= 0) {
      setErro("A quantidade deve ser um número inteiro positivo.");
      return;
    }

    if (Number(formulario.precoUnitario) < 0) {
      setErro("O preço unitário não pode ser negativo.");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        idComanda: formulario.idComanda.trim(),
        idCardapio: formulario.idCardapio.trim(),
        quantidade: formulario.quantidade,
        precoUnitario: formulario.precoUnitario,
      };

      const url = modoEdicao
        ? `${API_URL}/itens-comanda/${itemSelecionado.id}`
        : `${API_URL}/itens-comanda/`;

      const res = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Não foi possível salvar o item da comanda.");
      }

      await carregarItens();
      fecharModal();
    } catch (error) {
      setErro(error.message || "Erro ao salvar o item da comanda.");
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

      const res = await fetch(`${API_URL}/itens-comanda/${itemSelecionado.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || "Não foi possível excluir o item da comanda.");
      }

      setItens((prev) => prev.filter((item) => item.id !== itemSelecionado.id));
      fecharModalExclusao();
    } catch (error) {
      setErro(error.message || "Erro ao excluir o item da comanda.");
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
              Itens da comanda
            </h1>
            <span className="text-sm font-semibold text-gray-600">
              / ({itens.length})
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">Produtos pedidos em cada comanda</p>
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

      <div className="bg-[#EADCC8] border border-[#D8C7B0] rounded-xl px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-[#4A3525]">TOTAL GERAL</span>
        <span className="font-mono font-bold text-[#668126]">
          R$ {valorTotal.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="relative">
        <span className="absolute -top-2.5 left-3 bg-[#F5EBD7] px-1.5 text-xs font-mono rounded font-medium text-[#4A3525] z-10">
          procure
        </span>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="ID da comanda ou cardápio..."
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
          Carregando itens da comanda...
        </div>
      ) : itensFiltrados.length === 0 ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-8 text-center">
          <p className="font-bold text-[#4A3525]">
            {searchTerm ? "Nenhum item encontrado." : "Nenhum item cadastrado."}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Use o botão Adicionar item para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {itensFiltrados.map((item) => (
            <ItemComandaCard
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
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl">
            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>
                <h2 className="font-black text-lg">
                  {modoEdicao ? "Editar item" : "Novo item da comanda"}
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
                <label className="block text-xs font-bold text-[#4A3525] mb-1">ID da comanda</label>
                <input
                  name="idComanda"
                  value={formulario.idComanda}
                  onChange={alterarCampo}
                  placeholder="UUID da comanda"
                  autoFocus
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">ID do cardápio</label>
                <input
                  name="idCardapio"
                  value={formulario.idCardapio}
                  onChange={alterarCampo}
                  placeholder="UUID do item do cardápio"
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">Quantidade</label>
                  <input
                    name="quantidade"
                    type="number"
                    min="1"
                    step="1"
                    value={formulario.quantidade}
                    onChange={alterarCampo}
                    placeholder="1"
                    className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">Preço unitário</label>
                  <input
                    name="precoUnitario"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formulario.precoUnitario}
                    onChange={alterarCampo}
                    placeholder="0,00"
                    className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                  />
                </div>
              </div>

              <div className="bg-[#EADCC8] border border-[#D8C7B0] rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A3525]">Subtotal previsto</span>
                <span className="font-mono font-bold text-[#668126]">
                  R$ {(
                    (Number(formulario.quantidade) || 0) *
                    (Number(formulario.precoUnitario) || 0)
                  ).toFixed(2).replace(".", ",")}
                </span>
              </div>

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

      {modalExcluir && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">
            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">Confirmação</p>
              <h2 className="font-black text-lg">Excluir item da comanda</h2>
            </div>

            <div className="p-4">
              {erro && (
                <div className="mb-3 bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}
              <p className="text-sm text-[#4A3525]">
                Deseja realmente excluir este item da comanda?
              </p>

              <div className="flex gap-2 mt-4">
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm transition disabled:opacity-50"
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
