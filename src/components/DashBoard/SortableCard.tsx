import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableCardProps = {
  id: number;
  content: string;
  onDelete: (id: number) => void;
  slug: string;
};

const SortableCard = ({ id, content, onDelete, slug }: SortableCardProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg p-3 shadow-sm border border-gray-200 
        cursor-grab flex justify-between items-center
        ${isDragging ? "opacity-50 rotate-2 shadow-lg" : "hover:shadow-md"}
        transition-all duration-200
      `}
    >
      <div className="flex-1 text-gray-800">{content}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="
          text-red-500 hover:text-red-700 
          text-lg font-bold ml-2
          w-6 h-6 flex items-center justify-center
          hover:bg-red-50 rounded
        "
      >
        ×
      </button>
    </div>
  );
};

export default SortableCard;
