import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export function EstoqueCard({
  product,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(product.id)}
            className="mt-1 w-5 h-5 rounded border-[#3B2314] accent-[#C85327] cursor-pointer"
          /> */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1F1712] text-lg leading-tight capitalize">
                {product.name}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#EADCC8] text-[#4A3525]">
                {product.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5 tracking-wider">
              ID: <span className="font-semibold text-gray-700">{product.code}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
            preço
          </span>
          <span className="font-extrabold text-[#1F1712] text-lg">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F0E4D4] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#4A3525]">
          <span className="font-medium">quantidade:</span>
          <span className="bg-[#EADCC8] px-2.5 py-0.5 rounded font-mono font-bold text-xs text-[#2A1A0F]">
            {product.quantity} {product.unit}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#3B2314]">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 hover:bg-[#EADCC8] rounded-md transition"
            title="Editar produto"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
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