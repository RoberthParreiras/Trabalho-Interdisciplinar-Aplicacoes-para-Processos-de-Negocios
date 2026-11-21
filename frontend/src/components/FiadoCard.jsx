import { Pencil, Trash2 } from "lucide-react";

function formatarDataBR(dataVencimento) {
  if (!dataVencimento) return "--/--/----";

  const [ano, mes, dia] = String(dataVencimento).slice(0, 10).split("-");

  if (!ano || !mes || !dia) return "--/--/----";

  return `${dia}/${mes}/${ano}`;
}

export function FiadoCard({ item, onEdit, onDelete }) {
  const renderStatusBadge = (dataVencimento) => {

    const dataVencimentoISO = new Date(
      `${String(dataVencimento).slice(0, 10)}T00:00:00`,
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (hoje <= dataVencimentoISO) {
      return (
        <span className="bg-[#E58E00] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Pendente
        </span>
      );
    } else if (hoje > dataVencimentoISO) {
      return (
        <span className="bg-[#EA3838] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Atrasado
        </span>
      );
    }

    // switch (status) {
    //   case "atrasado":
    //     return (
    //       <span className="bg-[#EA3838] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
    //         Atrasado
    //       </span>
    //     );
    //   case "pendente":
    //     return (
    //       <span className="bg-[#E58E00] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
    //         Pendente
    //       </span>
    //     );
    //   case "pago":
    //     return (
    //       <span className="bg-[#1CB55C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
    //         Pago
    //       </span>
    //     );

    return null;
  };

  return (
    <div className="bg-[#FCF8F2] border border-[#D8C7B0] rounded-2xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-[#1F1712] text-lg font-mono leading-tight">
              {item.nome}
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              CPF: {item.cpf}
            </p>
          </div>
        </div>

        <div>{renderStatusBadge(item.dataVencimento)}</div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F0E4D4] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
              TOTAL DEVIDO
            </span>
            <span className="font-bold text-[#1F1712] text-base font-mono">
              R$ {Number(item.valor).toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
              VENCIMENTO
            </span>
            <span className="font-semibold text-gray-800 text-sm font-mono">
              {formatarDataBR(item.dataVencimento)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#3B2314]">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-[#EADCC8] rounded-md transition"
            title="Editar cliente"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 hover:bg-red-100 hover:text-red-700 rounded-md transition"
            title="Excluir ou quitar fiado"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
