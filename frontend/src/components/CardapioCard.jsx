import { Pencil, Trash2 } from "lucide-react";

const formatarPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CardapioCard({ item, onEdit, onDelete }) {
  return (
    <article className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[#1F1712] text-lg leading-tight">
            {item.nome}
          </h3>
          <p className="text-sm font-bold text-[#8A3D1C] mt-1">
            {formatarPreco.format(Number(item.preco))}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[#3B2314]">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-[#EADCC8] rounded-md transition"
            title="Editar item"
            aria-label={`Editar ${item.nome}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 hover:bg-red-100 hover:text-red-700 rounded-md transition"
            title="Excluir item"
            aria-label={`Excluir ${item.nome}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F0E4D4]">
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            item.disponivel
              ? "bg-[#E5EBCF] text-[#3C5117]"
              : "bg-[#EADCC8] text-[#6A5140]"
          }`}
        >
          {item.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </div>
    </article>
  );
}
