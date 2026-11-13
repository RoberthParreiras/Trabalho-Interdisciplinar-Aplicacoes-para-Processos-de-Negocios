import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-[#F5EAD2] flex flex-col items-center overflow-hidden">

      {/* TÍTULO */}
      <div className="mt-[8vh] flex flex-col items-center leading-[0.78] select-none">
        <span className="font-sans font-extrabold text-[clamp(76px,9.4vw,150px)] tracking-[-0.045em] text-[#F10D00] [-webkit-text-stroke:3px_#FFD34D]">
          SGB
        </span>

        <span className="font-sans font-extrabold text-[clamp(76px,9.4vw,150px)] tracking-[-0.045em] text-[#F10D00] [-webkit-text-stroke:3px_#FFD34D]">
          MAGAIVER
        </span>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/estoque');
        }}
        className="w-[min(490px,85vw)] mt-[12vh] flex flex-col gap-6"
      >
        <input
          type="text"
          placeholder="Usuário"
          required
          className="w-full h-[75px] rounded-[22px] bg-white border-2 border-[#C95B22] px-6 text-2xl text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#C95B22]"
        />

        <input
          type="password"
          placeholder="Senha"
          required
          className="w-full h-[75px] rounded-[22px] bg-white border-2 border-[#C95B22] px-6 text-2xl text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#C95B22]"
        />

        <button
          type="submit"
          className="w-full min-h-[85px] mt-4 rounded-[28px] bg-[#C95B22] text-white font-mono text-3xl tracking-wide hover:bg-[#BB501A] active:scale-[0.99] transition duration-150"
        >
          Logar
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-[#8C431F] text-lg hover:underline mt-2"
        >
          Voltar
        </button>
      </form>
    </main>
  );
}
