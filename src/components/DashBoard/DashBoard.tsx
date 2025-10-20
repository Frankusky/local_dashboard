import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardOverlay from "@/components/DashBoard/CardOverlay";
import ColumnOverlay from "@/components/DashBoard/ColumnOverlay";
import SortableColumn from "@/components/DashBoard/SortableColumn";
import AddColumn from "@/components/DashBoard/AddColumn";
import {
  DashboardCardType,
  DashboardColumnType,
} from "@/components/DashBoard/Dashboard.types";
import { DashboardService } from "@/services/DashboardService/DashboardService";

const Dashboard = () => {
  const [columns, setColumns] = useState<DashboardColumnType[]>([]);

  const [activeCard, setActiveCard] = useState<DashboardCardType | null>(null);
  const [activeColumn, setActiveColumn] = useState<DashboardColumnType | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manejar el inicio del arrastre
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Verificar si es una columna
    const column = columns.find(
      (col) => col.slug === active.data.current?.slug
    ) as DashboardColumnType;
    if (column) {
      setActiveColumn(column);
      return;
    }

    // Verificar si es una tarjeta
    for (const col of columns) {
      const card = col.cards.find(
        (card) => card.slug === active.data.current?.slug
      );
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  // Manejar el arrastre de tarjetas y columnas
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    if (!over) return;

    const activeSlug = active.data.current?.slug as string;
    const overSlug = over.data.current?.slug;

    // REORDENAR COLUMNAS
    if (activeSlug.startsWith("column-")) {
      const activeColumnIndex = columns.findIndex(
        (col) => col.slug === activeSlug
      );
      const overColumnIndex = columns.findIndex((col) => col.slug === overSlug);

      if (
        activeColumnIndex !== -1 &&
        overColumnIndex !== -1 &&
        activeColumnIndex !== overColumnIndex
      ) {
        setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
      }
      return;
    }

    const sourceColumn = columns.find((column) =>
      column.cards.some((card) => card.slug === activeSlug)
    );

    if (!sourceColumn) return;

    const sourceIndex = sourceColumn.cards.findIndex(
      (card) => card.slug === activeSlug
    );
    const sourceCard = sourceColumn.cards[sourceIndex];

    const overColumn = columns.find((column) => column.slug === overSlug);

    let destinationColumn = columns.find((column) =>
      column.cards.some((card) => card.slug === overSlug)
    );
    let destinationIndex = -1;

    if (destinationColumn) {
      destinationIndex = destinationColumn.cards.findIndex(
        (card) => card.slug === overSlug
      );
    } else if (overColumn) {
      destinationColumn = overColumn;
      destinationIndex = destinationColumn.cards.length; // Agregar al final
    }

    if (!destinationColumn) return;

    if (sourceColumn.id === destinationColumn.id) {
      const newCards = arrayMove(
        sourceColumn.cards,
        sourceIndex,
        destinationIndex
      );
      setColumns(
        columns.map((column) =>
          column.id === sourceColumn.id
            ? { ...column, cards: newCards }
            : column
        )
      );
    } else {
      // Mover entre columnas diferentes
      setColumns(
        columns.map((column) => {
          if (column.id === sourceColumn.id) {
            // Remover de la columna origen
            return {
              ...column,
              cards: column.cards.filter((card) => card.slug !== activeSlug),
            };
          } else if (column.id === destinationColumn.id) {
            // Agregar a la columna destino
            const newCards = [...column.cards];
            newCards.splice(destinationIndex, 0, sourceCard);
            return {
              ...column,
              cards: newCards,
            };
          }
          return column;
        })
      );
    }
  };

  const handleAddCard = async (columnId: number, content: string) => {
    await DashboardService.addCard({
      columnId,
      slug: `card-${Date.now()}`,
      content,
    });
  };

  const handleDeleteCard = (cardId: number) => {
    DashboardService.deleteCard(cardId);
  };

  const handleAddColumn = async () => {
    await DashboardService.addColumn({
      slug: `column-${Date.now()}`,
      title: `Nueva Columna ${columns.length + 1}`,
    });
  };

  const handleDeleteColumn = async (columnId: number) => {
    await DashboardService.deleteColumn(columnId);
  };

  const dashboardData = DashboardService.useGetDashboardData();

  useEffect(() => {
    if (dashboardData) setColumns(dashboardData);
  }, [dashboardData]);

  return (
    <div className={`max-h-screen min-h-full p-4`}>
      <div className="max-w-full h-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col.slug)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 overflow-x-auto min-h-full">
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  id={column.id as number}
                  title={column.title}
                  cards={column.cards}
                  slug={column.slug}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                  onDeleteColumn={handleDeleteColumn}
                />
              ))}

              <AddColumn onAddColumn={handleAddColumn} />
            </div>
          </SortableContext>

          <DragOverlay>
            {activeCard ? <CardOverlay card={activeCard} /> : null}
            {activeColumn ? <ColumnOverlay column={activeColumn} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Dashboard;
