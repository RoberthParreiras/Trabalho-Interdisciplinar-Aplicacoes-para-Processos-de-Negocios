import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, UserRound } from "lucide-react";
import { UsuarioCard } from "../components/UsuarioCard";

const API_URL = "http://localhost:3000/usuarios";

const formularioInicial = {
  nome: "",
  usuario: "",
  senha: "",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // =========================
  // BUSCAR USUÁRIOS
  // =========================

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      setErro("");

      const res = await fetch(`${API_URL}/`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível carregar os usuários."
        );
      }

      setUsuarios(data);
    } catch (error) {
      setErro(error.message || "Erro ao carregar usuários.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // =========================
  // FILTRO
  // =========================

  const usuariosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    if (!termo) return usuarios;

    return usuarios.filter(
      (item) =>
        item.nome.toLowerCase().includes(termo) ||
        item.usuario.toLowerCase().includes(termo)
    );
  }, [usuarios, searchTerm]);

  // =========================
  // ABRIR MODAL - CRIAÇÃO
  // =========================

  function abrirModalCriacao() {
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  // =========================
  // ABRIR MODAL - EDIÇÃO
  // =========================

  function abrirModalEdicao(usuario) {
    setModoEdicao(true);
    setUsuarioSelecionado(usuario);

    setFormulario({
      nome: usuario.nome,
      usuario: usuario.usuario,
      senha: "",
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
    setUsuarioSelecionado(null);
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
  // CRIAR / EDITAR USUÁRIO
  // =========================

  async function salvarUsuario(event) {
    event.preventDefault();

    setErro("");

    if (!formulario.nome.trim() || !formulario.usuario.trim()) {
      setErro("Nome e usuário são obrigatórios.");
      return;
    }

    if (!modoEdicao && !formulario.senha) {
      setErro("A senha é obrigatória para criar um usuário.");
      return;
    }

    try {
      setSalvando(true);

      const url = modoEdicao
        ? `${API_URL}/${usuarioSelecionado.id}`
        : `${API_URL}/`;

      const body = {
        nome: formulario.nome.trim(),
        usuario: formulario.usuario.trim(),
      };

      // Só envia senha se ela foi preenchida
      if (formulario.senha) {
        body.senha = formulario.senha;
      }

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
          data.mensagem || "Não foi possível salvar o usuário."
        );
      }

      await carregarUsuarios();

      fecharModal();
    } catch (error) {
      setErro(error.message || "Erro ao salvar usuário.");
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // EXCLUIR USUÁRIO
  // =========================

  async function deletarUsuario(usuario) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o usuário "${usuario.nome}"?`
    );

    if (!confirmar) return;

    try {
      setErro("");

      const res = await fetch(`${API_URL}/${usuario.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Não foi possível excluir o usuário."
        );
      }

      setUsuarios((prev) =>
        prev.filter((item) => item.id !== usuario.id)
      );
    } catch (error) {
      setErro(error.message || "Erro ao excluir usuário.");
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <div className="flex items-center justify-between gap-3">

        <div>
          <div className="flex items-baseline gap-2">

            <h1 className="text-2xl font-black font-mono tracking-tight text-[#1F1712]">
              Usuários
            </h1>

            <span className="text-sm font-semibold text-gray-600">
              / ({usuarios.length})
            </span>

          </div>

          <p className="text-xs text-gray-600 mt-0.5">
            Gestão de usuários do sistema
          </p>
        </div>

        {/* BOTÃO ADICIONAR */}

        <button
          type="button"
          onClick={abrirModalCriacao}
          className="
            bg-[#8AA639]
            hover:bg-[#78932F]
            text-[#1E2E06]
            font-bold
            px-4
            py-2
            rounded-xl
            text-xs
            flex
            flex-col
            items-center
            justify-center
            leading-tight
            shadow
            transition
            active:scale-95
            whitespace-nowrap
          "
        >
          <Plus size={16} />

          <span>Adicionar</span>

          <span>usuário</span>
        </button>

      </div>

      {/* =========================
          PESQUISA
      ========================= */}

      <div className="relative">

        <span
          className="
            absolute
            -top-2.5
            left-3
            bg-[#F5EBD7]
            px-1.5
            text-xs
            font-mono
            font-medium
            text-[#4A3525]
            z-10
          "
        >
          procure
        </span>

        <div className="relative flex items-center">

          <input
            type="text"
            placeholder="Nome ou usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              bg-[#E3D6C3]
              border
              border-[#BFAFA0]
              rounded-xl
              px-3
              py-2.5
              pr-10
              text-sm
              text-[#1F1712]
              focus:outline-none
              focus:ring-2
              focus:ring-[#C85327]
              placeholder-gray-500
            "
          />

          <Search
            className="absolute right-3 text-gray-600"
            size={18}
          />

        </div>
      </div>

      {/* =========================
          ERRO
      ========================= */}

      {erro && !modalAberto && (
        <div
          className="
            bg-red-100
            border
            border-red-300
            text-red-800
            rounded-xl
            px-3
            py-2
            text-sm
          "
        >
          {erro}
        </div>
      )}

      {/* =========================
          CARREGANDO
      ========================= */}

      {carregando ? (

        <div
          className="
            bg-[#FCF8F2]
            border
            border-[#D8C7B0]
            rounded-2xl
            p-6
            text-center
            text-sm
            text-gray-500
          "
        >
          Carregando usuários...
        </div>

      ) : usuariosFiltrados.length === 0 ? (

        /* =========================
           NENHUM USUÁRIO
        ========================= */

        <div
          className="
            bg-[#FCF8F2]
            border
            border-[#D8C7B0]
            rounded-2xl
            p-8
            text-center
          "
        >

          <UserRound
            className="mx-auto text-[#8A7664]"
            size={34}
          />

          <p className="mt-2 font-bold text-[#4A3525]">

            {searchTerm
              ? "Nenhum usuário encontrado."
              : "Nenhum usuário cadastrado."}

          </p>

          <p className="text-xs text-gray-500 mt-1">

            {searchTerm
              ? "Tente pesquisar por outro nome ou usuário."
              : "Use o botão Adicionar usuário para cadastrar o primeiro."}

          </p>

        </div>

      ) : (

        /* =========================
           LISTA DE USUÁRIOS
        ========================= */

        <div className="flex flex-col gap-3">

          {usuariosFiltrados.map((usuario) => (

            <UsuarioCard
              key={usuario.id}
              usuario={usuario}
              onEdit={abrirModalEdicao}
              onDelete={deletarUsuario}
            />

          ))}

        </div>

      )}

      {/* =========================
          MODAL
      ========================= */}

      {modalAberto && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-[#FCF8F2]
              rounded-2xl
              border
              border-[#D8C7B0]
              shadow-2xl
              overflow-hidden
            "
          >

            {/* CABEÇALHO DO MODAL */}

            <div
              className="
                bg-[#2E1A0F]
                text-[#F5EBD7]
                px-4
                py-3
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-widest
                    text-[#F39C12]
                    font-bold
                  "
                >
                  SGB MAGAIVER
                </p>

                <h2 className="font-black text-lg">

                  {modoEdicao
                    ? "Editar usuário"
                    : "Novo usuário"}

                </h2>

              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="
                  p-1.5
                  hover:bg-[#4A2D19]
                  rounded-lg
                  transition
                "
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORMULÁRIO */}

            <form
              onSubmit={salvarUsuario}
              className="p-4 flex flex-col gap-4"
            >

              {/* ERRO DO FORMULÁRIO */}

              {erro && (
                <div
                  className="
                    bg-red-100
                    border
                    border-red-300
                    text-red-800
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                  "
                >
                  {erro}
                </div>
              )}

              {/* NOME */}

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-bold
                    text-[#4A3525]
                    mb-1
                  "
                >
                  Nome
                </label>

                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  placeholder="Nome completo"
                  autoFocus
                  className="
                    w-full
                    bg-[#E3D6C3]
                    border
                    border-[#BFAFA0]
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C85327]
                  "
                />

              </div>

              {/* USUÁRIO */}

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-bold
                    text-[#4A3525]
                    mb-1
                  "
                >
                  Usuário
                </label>

                <input
                  name="usuario"
                  value={formulario.usuario}
                  onChange={alterarCampo}
                  placeholder="Nome de acesso"
                  className="
                    w-full
                    bg-[#E3D6C3]
                    border
                    border-[#BFAFA0]
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C85327]
                  "
                />

              </div>

              {/* SENHA */}

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-bold
                    text-[#4A3525]
                    mb-1
                  "
                >

                  Senha

                  {modoEdicao && (
                    <span className="font-normal text-gray-500">
                      {" "}
                      (deixe vazio para manter)
                    </span>
                  )}

                </label>

                <input
                  type="password"
                  name="senha"
                  value={formulario.senha}
                  onChange={alterarCampo}
                  placeholder={
                    modoEdicao
                      ? "Nova senha"
                      : "Senha"
                  }
                  className="
                    w-full
                    bg-[#E3D6C3]
                    border
                    border-[#BFAFA0]
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C85327]
                  "
                />

              </div>

              {/* BOTÕES */}

              <div className="flex gap-2 pt-1">

                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="
                    flex-1
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-[#BFAFA0]
                    text-[#4A3525]
                    font-bold
                    text-sm
                    hover:bg-[#EADCC8]
                    transition
                    disabled:opacity-50
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="
                    flex-1
                    px-4
                    py-2.5
                    rounded-xl
                    bg-[#8AA639]
                    hover:bg-[#78932F]
                    text-[#1E2E06]
                    font-bold
                    text-sm
                    transition
                    disabled:opacity-50
                  "
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

    </div>
  );
}