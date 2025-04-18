import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const shiftTimes = {
  sabah: { start: "08:00", end: "16:30" },
  aksam: { start: "13:30", end: "22:00" },
};

const EditModal = ({ modalOpen, initialData, setModalOpen }) => {
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("sabah");
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");

  console.log(initialData);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.users?.length > 0) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      setError("Error fetchin users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  useEffect(() => {
    if (initialData) {
      const dt = new Date(initialData.start);
      setDate(dt.toISOString().split("T")[0]);
      const isSabah = initialData.start.includes("08:00");
      setShift(isSabah ? "sabah" : "aksam");
      setEmployee(initialData.employee._id);
      setNotes(initialData.notes || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    const { start, end } = shiftTimes[shift];

    const startISO = new Date(`${date}T${start}+02:00`).toISOString();
    const endISO = new Date(`${date}T${end}+02:00`).toISOString();

    try {
      const response = await axiosInstance.put(
        API_PATH.SHIFTS.UPDATE_SHIFTS(initialData.id),
        {
          employee,
          start: startISO,
          end: endISO,
          notes,
        }
      );
      if (response.status === 200) {
        console.log("User Updated");
        setModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      setError(error);
    }
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Shift</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              ID
            </label>
            <input
              type="text"
              name="id"
              readOnly
              value={initialData._id}
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Employee
            </label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Please Select</option>
              {allUsers &&
                allUsers
                  .filter((user) => user.isActive)
                  .map((user, index) => (
                    <option key={index} value={user._id}>
                      {user.name}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Date Time
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Shifts
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="sabah">Morning (08:00 - 16:30)</option>
              <option value="aksam">Night (13:30 - 22:00)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Start
              </label>
              <input
                type="text"
                readOnly
                value={shiftTimes[shift].start}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                End
              </label>
              <input
                type="text"
                readOnly
                value={shiftTimes[shift].end}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="(Optional) Please write something..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Shift
            </button>
          </div>

          {error && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Error
              </label>
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditModal;
