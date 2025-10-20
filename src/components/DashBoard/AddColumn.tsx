type AddColumnProps = {
  onAddColumn: () => void;
};

const AddColumn = ({ onAddColumn }: AddColumnProps) => {
  return (
    <div
      onClick={onAddColumn}
      className="bg-gray-100 rounded-xl p-4 min-w-[300px] min-h-[600px] border-2 border-dashed border-gray-300 flex flex-col cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 items-center justify-center"
    >
      <div className="text-center">
        <div className="text-4xl text-gray-400 mb-2">+</div>
        <p className="text-gray-600 font-medium">Add Column</p>
        <p className="text-gray-400 text-sm mt-1">
          Click here to add a new column
        </p>
      </div>
    </div>
  );
};

export default AddColumn;
