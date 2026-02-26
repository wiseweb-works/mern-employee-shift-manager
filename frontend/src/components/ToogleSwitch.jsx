const ToggleSwitch = ({ editMode, setEditMode }) => {
  const switchId = `toggle-mode`;
  return (
    <div className="flex items-center space-x-3">
      <span id={switchId} className="text-sm text-gray-700">
        {!editMode ? "Ansichtsmodus" : "Bearbeitungsmodus"}
      </span>

      <button
        onClick={() => setEditMode(!editMode)}
        role="switch"
        aria-checked={editMode}
        aria-labelledby={switchId}
        className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
          editMode ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
            editMode ? "translate-x-6" : ""
          }`}
        ></div>
      </button>
    </div>
  );
};

export default ToggleSwitch;
