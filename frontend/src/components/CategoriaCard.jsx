import { Pencil, Trash2 } from "lucide-react";

export function CategoriaCard({ categoria, onEdit, onDelete }) {
  return (
    <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-[#1F1712] text-lg leading-tight capitalize">
          {categoria.nome}
        </h3>

        <div className="flex items-center gap-1 text-[#3B2314]">
          <button
            type="button"
            onClick={() => onEdit(categoria)}
            className="p-1.5 hover:bg-[#EADCC8] rounded-md transition"
            title="Editar produto"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(categoria)}
            className="p-1.5 hover:bg-red-100 hover:text-red-700 rounded-md transition"
            title="Excluir produto"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
