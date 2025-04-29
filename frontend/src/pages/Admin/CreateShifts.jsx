import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatisticBar from "../../components/StatisticBar";
import createMockData from "../../helpers/createMockData";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";

import { viewDay, viewMonthGrid } from "@schedule-x/calendar";
import ShiftCalendar from "../../components/Calendars/ShiftCalendar";
import moment from "moment";
import toast from "react-hot-toast";

const CreateShifts = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);

  const selectedDay = moment()
    .add(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  const year = selectedDay.slice(0, 4);
  const month = selectedDay.slice(5, 7);

  const handleShiftUpdate = (updated) => {
    const filtered = events.filter((event) => event.id !== updated.id);
    setEvents([...filtered, updated]);
  };

  const shiftSave = async () => {
    const isConfirmed = window.confirm(
      "Dadurch werden die bestehenden Schichten gelöscht und entsprechend Ihrer Auswahl neu geschrieben!"
    );
    if (isConfirmed) {
      try {
        const deleteResponse = await axiosInstance.delete(
          API_PATH.SHIFTS.DELETE_SHIFTS_BY_MONTH(month, year)
        );
        if (deleteResponse.status === 200) {
          const response = await axiosInstance.post(
            API_PATH.SHIFTS.CREATE_SHIFTS,
            [
              ...events.map((event) => ({
                employee: event.uid,
                start: moment.tz(event.start, "Europe/Berlin").utc().format(),
                end: moment.tz(event.end, "Europe/Berlin").utc().format(),
              })),
            ]
          );
          if (response.status === 201) {
            toast.success("Schichten wurden erfolgreich erstellt");
          }
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const getAllUsers = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (result.data?.users?.length > 0) {
        setAllUsers(result.data.users);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  const handleDisable = (input, shift) => {
    const team = allUsers.filter((user) => user.team === input.team);
    const morningTeam = team.filter(
      (user) => user.shiftChoice === "morning"
    ).length;
    const nightTeam = team.filter(
      (user) => user.shiftChoice === "night"
    ).length;
    if (shift === "morning") return morningTeam === Math.ceil(team.length / 2);
    if (shift === "night") return nightTeam === Math.ceil(team.length / 2);
  };

  useEffect(() => {
    const newEvents = createMockData(allUsers, selectedDay).map((event) => ({
      ...event,
      start: moment
        .utc(event.start)
        .tz("Europe/Berlin")
        .format("YYYY-MM-DD HH:mm"),
      end: moment.utc(event.end).tz("Europe/Berlin").format("YYYY-MM-DD HH:mm"),
    }));
    setEvents(newEvents);
    return () => {};
  }, [allUsers]);

  return (
    <DashboardLayout activeMenu="Schichten erstellen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Schichten erstellen</h5>
              <button className="card-btn" onClick={() => setShow(!show)}>
                {show ? "Kalender ausblenden" : "Kalender anzeigen"}
              </button>
              <button className="card-btn" onClick={shiftSave}>
                Schichten speichern
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-6 mt-5">
              {!show &&
                events.length > 0 &&
                allUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-5 rounded-full ${
                          user.team === "sozialbetreuerhelfer"
                            ? "bg-yellow-500"
                            : user.team === "sozialarbeiter"
                            ? "bg-primary"
                            : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm md:text-base font-semibold text-black capitalize">
                          {user.name}
                        </p>
                        <p className="capitalize ">{user.team}</p>
                      </div>
                    </div>

                    <div className="flex flex-row gap-2 flex-wrap">
                      <button
                        disabled={handleDisable(user, "morning")}
                        onClick={() => {
                          const updated = [...allUsers];
                          updated[index].shiftChoice = "morning";
                          setAllUsers(updated);
                        }}
                        className={`min-w-[70px] px-3 py-2 text-sm rounded-md font-medium shadow ${
                          user?.shiftChoice === "morning"
                            ? "bg-yellow-400 text-white"
                            : "border border-red-400 text-black"
                        }`}
                      >
                        Früh
                      </button>

                      <button
                        onClick={() => {
                          const updated = [...allUsers];
                          updated[index].shiftChoice = false;
                          setAllUsers(updated);
                        }}
                        className={`min-w-[70px] px-3 py-2 text-sm rounded-md font-medium shadow ${
                          !user.shiftChoice
                            ? "bg-blue-400 text-white"
                            : "border border-red-400 text-black"
                        }`}
                      >
                        Egal
                      </button>

                      <button
                        disabled={handleDisable(user, "night")}
                        onClick={() => {
                          const updated = [...allUsers];
                          updated[index].shiftChoice = "night";
                          setAllUsers(updated);
                        }}
                        className={`min-w-[70px] px-3 py-2 text-sm rounded-md font-medium shadow ${
                          user?.shiftChoice === "night"
                            ? "bg-purple-400 text-white"
                            : "border border-red-400 text-black"
                        }`}
                      >
                        Spät
                      </button>
                    </div>

                    <div className="w-full min-w-[210px] md:w-auto">
                      <StatisticBar events={events} user={user} />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4">
              {events?.length > 0 && selectedDay && show && (
                <ShiftCalendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthGrid, viewDay]}
                  selectedDay={selectedDay}
                  handleShiftUpdate={handleShiftUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateShifts;
