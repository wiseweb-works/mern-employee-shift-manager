const ToggleSwitch = ({ enabled, setEnabled }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-700">
        {!enabled ? "View Mode" : "Edit Mode"}
      </span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
            enabled ? "translate-x-6" : ""
          }`}
        ></div>
      </button>
    </div>
  );
};

export default ToggleSwitch;
