
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { FiadoCard } from "../components/FiadoCard";

const API_URL = "http://localhost:3000/fiados";

const formularioInicial = {
  nome: "",
  cpf: "",
  valor: "",
};

export default function Fiado() {
  const [fiadoList, setFiadoList] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [fiadoSelecionado, setFiadoSelecionado] = useState(null);

  const [formulario, setFormulario] = useState(formularioInicial);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [erro, setErro] = useState("");

  // =========================
  // BUSCAR FIADOS
  // =========================

  async function carregarFiados() {
    try {
      setCarregando(true);
      setErro("");

      const res = await fetch(`${API_URL}/`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível carregar os fiados.",
        );
      }

      setFiadoList(data);
    } catch (error) {
      setErro(error.message || "Erro ao carregar os fiados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFiados();
  }, []);

  // =========================
  // ABRIR MODAL - CRIAÇÃO
  // =========================

  function abrirModalCriacao() {
    setModoEdicao(false);
    setFiadoSelecionado(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  // =========================
  // ABRIR MODAL - EDIÇÃO
  // =========================

  function abrirModalEdicao(item) {
    setModoEdicao(true);
    setFiadoSelecionado(item);

    setFormulario({
      nome: item.nome ?? "",
      cpf: item.cpf ?? "",
      valor: item.valor?.toString() ?? "",
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
    setFiadoSelecionado(null);
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
  // CRIAR / EDITAR FIADO
  // =========================

  async function salvarFiado(event) {
    event.preventDefault();

    setErro("");

    if (!formulario.nome.trim()) {
      setErro("O nome do cliente é obrigatório.");
      return;
    }

    if (!modoEdicao && !formulario.cpf.trim()) {
      setErro("O CPF do cliente é obrigatório.");
      return;
    }

    if (formulario.valor === "" || Number(formulario.valor) < 0) {
      setErro("Informe um valor válido.");
      return;
    }

    if (!Number.isFinite(Number(formulario.valor))) {
      setErro("O valor informado é inválido.");
      return;
    }

    try {
      setSalvando(true);

      const url = modoEdicao
        ? `${API_URL}/${fiadoSelecionado.id}`
        : `${API_URL}/`;

      const body = modoEdicao
        ? {
            id: fiadoSelecionado.id,
            nome: formulario.nome.trim(),
            valor: Number(formulario.valor),
          }
        : {
            nome: formulario.nome.trim(),
            cpf: formulario.cpf.trim(),
            valor: formulario.valor,
          };

      const res = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível salvar o fiado.",
        );
      }

      await carregarFiados();
      fecharModal();
    } catch (error) {
      setErro(error.message || "Erro ao salvar o fiado.");
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // ABRIR MODAL - EXCLUSÃO
  // =========================

  function abrirModalExclusao(item) {
    setFiadoSelecionado(item);
    setErro("");
    setModalExcluir(true);
  }

  // =========================
  // FECHAR MODAL - EXCLUSÃO
  // =========================

  function fecharModalExclusao() {
    if (excluindo) return;

    setModalExcluir(false);
    setFiadoSelecionado(null);
    setErro("");
  }

  // =========================
  // EXCLUIR FIADO
  // =========================

  async function deletarFiado() {
    if (!fiadoSelecionado) return;

    try {
      setExcluindo(true);
      setErro("");

      const res = await fetch(
        `${API_URL}/${fiadoSelecionado.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível excluir o fiado.",
        );
      }

      setFiadoList((prev) =>
        prev.filter((item) => item.id !== fiadoSelecionado.id),
      );

      fecharModalExclusao();
    } catch (error) {
      setErro(error.message || "Erro ao excluir o fiado.");
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
              Controle Fiado
            </h1>

            <span className="text-sm font-semibold text-gray-600">
              / ({fiadoList.length})
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
          <span>Fiado</span>
        </button>
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
          Carregando fiados...
        </div>
      ) : fiadoList.length === 0 ? (
        <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-8 text-center">
          <p className="font-bold text-[#4A3525]">
            Nenhum fiado cadastrado.
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Use o botão Adicionar Fiado para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {fiadoList.map((item) => (
            <FiadoCard
              key={item.id}
              item={item}
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
                  {modoEdicao ? "Editar fiado" : "Novo fiado"}
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
              onSubmit={salvarFiado}
              className="p-4 flex flex-col gap-4"
            >

              {/* ERRO */}

              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              {/* NOME */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Nome do cliente
                </label>

                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  placeholder="Nome completo"
                  autoFocus
                  className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                />
              </div>

              {/* CPF */}

              {!modoEdicao && (
                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">
                    CPF do cliente
                  </label>

                  <input
                    name="cpf"
                    value={formulario.cpf}
                    onChange={alterarCampo}
                    placeholder="Digite o CPF"
                    className="w-full bg-[#E3D6C3] border border-[#BFAFA0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85327]"
                  />
                </div>
              )}

              {/* VALOR */}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Valor devido (R$)
                </label>

                <input
                  type="number"
                  name="valor"
                  value={formulario.valor}
                  onChange={alterarCampo}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
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

      {modalExcluir && fiadoSelecionado && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-[#D8C7B0] shadow-2xl overflow-hidden">

            {/* CABEÇALHO */}

            <div className="bg-[#2E1A0F] text-[#F5EBD7] px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F39C12] font-bold">
                  SGB MAGAIVER
                </p>

                <h2 className="font-black text-lg">
                  Excluir fiado
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

            {/* CONFIRMAÇÃO */}

            <div className="p-4 flex flex-col gap-4">
              {erro && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl px-3 py-2 text-sm">
                  {erro}
                </div>
              )}

              <p className="text-sm text-[#4A3525]">
                Deseja realmente excluir o registro de fiado de{" "}
                <strong>{fiadoSelecionado.nome}</strong>?
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
                  onClick={deletarFiado}
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
