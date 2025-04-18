const StatisticBar = ({ events, user }) => {
  const morningCount = events
    .filter((event) => event.uid === user._id)
    .filter((shift) => String(shift.start).endsWith("08:00")).length;

  const nightCount = events
    .filter((event) => event.uid === user._id)
    .filter((shift) => String(shift.end).endsWith("22:00")).length;

  const totalCount = events.filter((event) => event.uid === user._id).length;

  return (
    <div className="w-full max-w-md mx-auto text-xs md:text-sm">
      <div className="relative w-full h-6 bg-gray-200 rounded overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#F28444]"
          style={{
            width: `${(morningCount / totalCount) * 100}%`,
            zIndex: 12,
          }}
        />
        <div
          className="absolute top-0 left-0 h-full bg-[#1CA68D]"
          style={{
            width: `${((morningCount + nightCount) / totalCount) * 100}%`,
            zIndex: 11,
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-[12px] md:text-[14px] text-center">
        <span className="text-[#F28444] font-semibold">
          Morning: {morningCount}
        </span>
        <span className="text-[#9530D9] font-semibold">
          Total: {totalCount}
        </span>
        <span className="text-[#1CA68D] font-semibold">
          Night: {nightCount}
        </span>
      </div>
    </div>
  );
};

export default StatisticBar;
