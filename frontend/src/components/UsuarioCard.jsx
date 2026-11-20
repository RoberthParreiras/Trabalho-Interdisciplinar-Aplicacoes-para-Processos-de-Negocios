
import { UserRound, Pencil, Trash2 } from "lucide-react";

export function UsuarioCard({ usuario, onEdit, onDelete }) {
  return (
    <div className="
      bg-[#FCF8F2]
      border border-[#D8C7B0]
      rounded-2xl
      p-4
      flex items-center
      justify-between
      gap-3
      shadow-sm
    ">

      <div className="flex items-center gap-3 min-w-0">

        <div className="
          w-11 h-11
          rounded-full
          bg-[#E3D6C3]
          flex items-center justify-center
          text-[#4A3525]
          shrink-0
        ">
          <UserRound size={22} />
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-[#2E1A0F] truncate">
            {usuario.nome}
          </h3>

          <p className="text-xs text-gray-500 truncate">
            @{usuario.usuario}
          </p>

          <span className="
            inline-block
            mt-1
            text-[10px]
            font-bold
            text-[#668126]
            bg-[#E6EDCF]
            px-2 py-0.5
            rounded-full
          ">
            Usuário ativo
          </span>
        </div>

      </div>

      <div className="flex items-center gap-2 shrink-0">

        <button
          onClick={() => onEdit(usuario)}
          title="Editar usuário"
          className="
            p-2
            rounded-lg
            bg-[#E3D6C3]
            text-[#4A3525]
            hover:bg-[#D3C2AA]
            transition
          "
        >
          <Pencil size={17} />
        </button>

        <button
          onClick={() => onDelete(usuario)}
          title="Excluir usuário"
          className="
            p-2
            rounded-lg
            bg-red-100
            text-red-700
            hover:bg-red-200
            transition
          "
        >
          <Trash2 size={17} />
        </button>

      </div>

    </div>
  );
}
