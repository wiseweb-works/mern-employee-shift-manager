import { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import toast from "react-hot-toast";

const shiftTimes = {
  morning: { start: "08:00", end: "16:30" },
  night: { start: "13:30", end: "22:00" },
};

const EditModal = ({ modalOpen, initialData, setModalOpen }) => {
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("morning");
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const modalRef = useRef(null);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.users?.length > 0) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Fehler beim Abrufen der Benutzer:", error);
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
      const isMorning = initialData.start.includes("08:00");
      setShift(isMorning ? "morning" : "night");
      setEmployee(initialData.employee._id);
      setNotes(initialData.notes || "");
    }
  }, [initialData]);

  // Focus trapping
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

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
        },
      );
      if (response.status === 200) {
        toast.success("Benutzer aktualisiert");
        setModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (shiftId) => {
    const isConfirmed = window.confirm(
      "Sind Sie sicher, dass Sie diese Schicht löschen möchten?",
    );

    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          API_PATH.SHIFTS.GET_SHIFTS_BY_ID(shiftId),
        );
        if (response.status === 200) {
          setModalOpen(false);
          window.location.reload();
        }
      } catch (error) {
        toast.error("Fehler beim Löschen der Schichten:", error);
      }
    }
  };

  if (!modalOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            Schicht bearbeiten
          </h2>
          <button
            onClick={() => setModalOpen(false)}
            aria-label="Schließen"
            className="text-gray-500 hover:text-gray-800 text-2xl focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-id"
              className="block text-sm font-medium text-gray-600"
            >
              ID
            </label>
            <div className="flex flex-row justify-between gap-2">
              <input
                id="edit-id"
                type="text"
                name="id"
                readOnly
                disabled
                value={initialData._id}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
              />
              <button
                type="button"
                onClick={() => handleDelete(initialData._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Löschen
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-employee"
              className="block text-sm font-medium text-gray-600"
            >
              Mitarbeiter
            </label>
            <select
              id="edit-employee"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Bitte auswählen</option>
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
            <label
              htmlFor="edit-date"
              className="block text-sm font-medium text-gray-600"
            >
              Datum
            </label>
            <input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-shift"
              className="block text-sm font-medium text-gray-600"
            >
              Schicht
            </label>
            <select
              id="edit-shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="morning">Frühschicht (08:00 - 16:30)</option>
              <option value="night">Spätschicht (13:30 - 22:00)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-start"
                className="block text-sm font-medium text-gray-600"
              >
                Beginn
              </label>
              <input
                id="edit-start"
                type="text"
                readOnly
                value={shiftTimes[shift].start}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
              />
            </div>
            <div>
              <label
                htmlFor="edit-end"
                className="block text-sm font-medium text-gray-600"
              >
                Ende
              </label>
              <input
                id="edit-end"
                type="text"
                readOnly
                value={shiftTimes[shift].end}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-notes"
              className="block text-sm font-medium text-gray-600"
            >
              Notizen
            </label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="(Optional) Bitte schreiben Sie etwas..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
            >
              Schließen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Schicht aktualisieren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
