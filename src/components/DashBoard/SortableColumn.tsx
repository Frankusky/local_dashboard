import SortableCard from "@/components/DashBoard/SortableCard";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { DashboardCardType } from "@/components/DashBoard/Dashboard.types";

type SortableColumnProps = {
  id: number;
  title: string;
  cards: DashboardCardType[];
  slug: string;
  onAddCard: (id: number, content: string) => void;
  onDeleteCard: (id: number) => void;
  onDeleteColumn: (id: number) => void;
};

const SortableColumn = ({
  id,
  title,
  cards,
  slug,
  onAddCard,
  onDeleteCard,
  onDeleteColumn,
}: SortableColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slug, data: { slug } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [newCardContent, setNewCardContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      onAddCard(id, newCardContent);
      setNewCardContent("");
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-gray-100 rounded-xl p-4 min-w-[300px] min-h-full
        shadow-sm border border-gray-200 flex flex-col
        ${isDragging ? "opacity-50 rotate-2 shadow-lg border-blue-300" : ""}
        transition-all duration-200
      `}
    >
      {/* Header de la columna - ahora es arrastrable */}
      <div
        {...attributes}
        {...listeners}
        className="
          bg-white rounded-lg p-3 mb-4 cursor-grab
          flex justify-between items-center
          shadow-sm border border-gray-200
          hover:shadow-md transition-shadow
        "
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteColumn(id);
          }}
          className="
            text-red-500 hover:text-red-700 
            text-lg font-bold
            w-6 h-6 flex items-center justify-center
            hover:bg-red-50 rounded transition-colors
          "
        >
          ×
        </button>
      </div>

      {/* Sección para agregar tarjetas */}
      <div className="mb-4">
        {isAdding ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="Escribe el contenido..."
              onKeyPress={(e) => e.key === "Enter" && handleAddCard()}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              "
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="
                  bg-green-500 hover:bg-green-600 text-white 
                  px-3 py-1 rounded-lg text-sm flex-1
                  transition-colors
                "
              >
                Agregar
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="
                  bg-gray-500 hover:bg-gray-600 text-white 
                  px-3 py-1 rounded-lg text-sm
                  transition-colors
                "
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="
              w-full bg-white hover:bg-gray-50 text-gray-600 
              py-2 rounded-lg border border-dashed border-gray-300
              transition-colors flex items-center justify-center gap-2
            "
          >
            <span>+</span>
            Agregar tarjeta
          </button>
        )}
      </div>

      {/* Lista de tarjetas */}
      <SortableContext
        items={cards.map((card) => card.slug)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              id={card.id}
              content={card.content}
              onDelete={onDeleteCard}
              slug={card.slug}
            />
          ))}
          {cards.length === 0 && (
            <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              Arrastra tarjetas aquí
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableColumn;
