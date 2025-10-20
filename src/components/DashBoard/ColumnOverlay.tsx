import { DashboardColumnType } from "@/components/DashBoard/Dashboard.types";

type ColumnOverlayProps = {
  column: DashboardColumnType;
};

const ColumnOverlay = ({ column }: ColumnOverlayProps) => (
  <div
    className="
    bg-gray-100 rounded-xl p-4 min-w-[300px] min-h-[600px]
    shadow-lg border-2 border-blue-300 flex flex-col
    rotate-2
  "
  >
    <div
      className="
      bg-white rounded-lg p-3 mb-4
      flex justify-between items-center
      shadow-sm border border-gray-200
    "
    >
      <h3 className="font-semibold text-gray-800 text-lg">{column.title}</h3>
      <div className="w-6 h-6 flex items-center justify-center text-gray-400">
        ×
      </div>
    </div>
    <div className="flex-1 space-y-3">
      {column.cards.slice(0, 2).map((card) => (
        <div
          key={card.id}
          className="
          bg-white rounded-lg p-3 shadow-sm border border-gray-200 
          opacity-70
        "
        >
          <div className="text-gray-800">{card.content}</div>
        </div>
      ))}
      {column.cards.length > 2 && (
        <div className="text-center text-gray-400 text-sm">
          +{column.cards.length - 2} más...
        </div>
      )}
    </div>
  </div>
);

export default ColumnOverlay;
