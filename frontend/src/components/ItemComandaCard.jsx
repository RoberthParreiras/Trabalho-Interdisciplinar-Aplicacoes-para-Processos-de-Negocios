import { Pencil, Trash2, ReceiptText } from "lucide-react";

export function ItemComandaCard({ item, onEdit, onDelete }) {
  const quantidade = Number(item.quantidade);
  const precoUnitario = Number(item.precoUnitario);
  const total = quantidade * precoUnitario;

  return (
    <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#E3D6C3] flex items-center justify-center text-[#4A3525] shrink-0">
            <ReceiptText size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-[#1F1712] leading-tight">
              Item da comanda
            </h3>
            <p className="text-xs text-gray-500 mt-1 break-all">
              Comanda: {item.idComanda}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 break-all">
              Cardápio: {item.idCardapio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-[#EADCC8] rounded-md transition"
            title="Editar item da comanda"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 hover:bg-red-100 hover:text-red-700 rounded-md transition"
            title="Excluir item da comanda"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F0E4D4] grid grid-cols-3 gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block">
            Quantidade
          </span>
          <span className="font-bold text-[#1F1712] font-mono">
            {quantidade}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block">
            Unitário
          </span>
          <span className="font-bold text-[#1F1712] font-mono">
            R$ {precoUnitario.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block">
            Total
          </span>
          <span className="font-bold text-[#668126] font-mono">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
}
