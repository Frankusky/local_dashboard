import { DashboardCardType } from "@/components/DashBoard/Dashboard.types";

type CardOverlayProps = {
  card: DashboardCardType;
};

const CardOverlay = ({ card }: CardOverlayProps) => (
  <div
    className="bg-white rounded-lg p-3 shadow-lg border border-blue-300 flex justify-between items-center w-full
rotate-2"
  >
    <div className="flex-1 text-gray-800">{card.content}</div>
  </div>
);

export default CardOverlay;
