
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-[#F5EAD2] flex flex-col items-center overflow-hidden">

      {/* LOGO */}
      <div className="mt-[8vh] flex flex-col items-center leading-[0.78] select-none">
        <span className="font-sans font-extrabold text-[clamp(76px,9.4vw,150px)] tracking-[-0.045em] text-[#F10D00] [-webkit-text-stroke:3px_#FFD34D]">
          SGB
        </span>

        <span className="font-sans font-extrabold text-[clamp(76px,9.4vw,150px)] tracking-[-0.045em] text-[#F10D00] [-webkit-text-stroke:3px_#FFD34D]">
          MAGAIVER
        </span>
      </div>

      {/* BOTÕES */}
      <div className="w-[min(490px,80vw)] mt-[18.5vh] flex flex-col gap-[44px]">

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full min-h-[108px] rounded-[34px] bg-[#C95B22] text-white font-mono text-[clamp(28px,2.4vw,42px)] tracking-wide hover:bg-[#BB501A] active:scale-[0.99] transition duration-150"
        >
          Fazer Login
        </button>

        {/* <button
          type="button"
          onClick={() => navigate('/cadastro')}
          className="w-full min-h-[108px] rounded-[34px] bg-[#C95B22] text-white font-mono text-[clamp(28px,2.4vw,42px)] tracking-wide hover:bg-[#BB501A] active:scale-[0.99] transition duration-150"
        >
          Fazer Cadastro
        </button> */}

      </div>

    </main>
  );
}
