import { useEffect, useState } from "react";
import { RiResetLeftFill } from "react-icons/ri";
import VertikalTable from "./VertikalTable";
import HorizontalTable from "./HorizontalTable";
import { TbFileOrientation } from "react-icons/tb";

const AdminShiftTable = ({ selectedMonth, users, filteredEvents }) => {
  const [teamFilter, setTeamFilter] = useState("all");
  const [workFilter, setWorkFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [orientation, setOrientation] = useState(true);

  const handleFilter = () => {
    let filtered = users;
    if (teamFilter !== "all") {
      filtered = filtered.filter((user) => user.team === teamFilter);
    } else {
      filtered = filtered.filter((user) => user.team);
    }
    if (workFilter !== "all") {
      filtered = filtered.filter((user) => user.workType === workFilter);
    } else {
      filtered = filtered.filter((user) => user.workType);
    }
    if (activeFilter === "active") {
      filtered = filtered.filter((user) => user.isActive);
    } else if (activeFilter === "deactive") {
      filtered = filtered.filter((user) => !user.isActive);
    } else {
      filtered = filtered.filter((user) => user.isActive !== "");
    }
    return filtered;
  };

  const handleReset = () => {
    setTeamFilter("all");
    setWorkFilter("all");
    setActiveFilter("all");
  };

  useEffect(() => {
    handleFilter();
  }, [teamFilter, workFilter, activeFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          className="flex md:flex download-btn shadow-sm"
          onClick={() => setOrientation(!orientation)}
        >
          <TbFileOrientation className="text-lg" />
        </button>
        <span className="select-boxx">{`Count: ${
          handleFilter()?.length
        }`}</span>
        <select
          className="select-boxx"
          onChange={(e) => setTeamFilter(e.target.value)}
          value={teamFilter}
        >
          <option value="all">Team</option>
          <option value="sozialarbeiter">Sozialarbeiter</option>
          <option value="sozialbetreuer">Sozialbetreuer</option>
          <option value="sozialbetreuerhelfer">Sozialbetreuerhelfer</option>
        </select>
        <select
          className="select-boxx"
          onChange={(e) => setWorkFilter(e.target.value)}
          value={workFilter}
        >
          <option value="all">Work Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
        <select
          className="select-boxx"
          onChange={(e) => setActiveFilter(e.target.value)}
          value={activeFilter}
        >
          <option value="all">Active/Deactive</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        {(teamFilter !== "all" || workFilter !== "all") && (
          <button
            className="flex md:flex download-btn shadow-sm"
            onClick={handleReset}
          >
            <RiResetLeftFill className="text-lg" />
            Reset
          </button>
        )}
      </div>

      {orientation ? (
        <VertikalTable
          selectedMonth={selectedMonth}
          handleFilter={handleFilter}
          filteredEvents={filteredEvents}
        />
      ) : (
        <HorizontalTable
          selectedMonth={selectedMonth}
          handleFilter={handleFilter}
          filteredEvents={filteredEvents}
        />
      )}
    </>
  );
};

export default AdminShiftTable;
