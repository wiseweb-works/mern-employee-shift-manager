function createMockData(allUsers, selectedDay) {
  selectedDay = new Date(selectedDay);
  const startDay = new Date(
    selectedDay.getFullYear(),
    selectedDay.getMonth(),
    1
  );
  const DAYS = new Date(
    selectedDay.getFullYear(),
    selectedDay.getMonth() + 1,
    0
  ).getDate();

  const SHIFTS = [
    {
      name: "Morning",
      startHour: 8,
      startMinute: 0,
      endHour: 16,
      endMinute: 30,
    },
    {
      name: "Night",
      startHour: 13,
      startMinute: 30,
      endHour: 22,
      endMinute: 0,
    },
  ];

  const allShifts = [];
  let idCounter = 1;

  const groupByTeam = (teamName) =>
    allUsers
      .filter((u) => u.isActive && u.team === teamName)
      .sort((a, b) => a.name.localeCompare(b.name));

  const splitShiftBalanced = (group) => {
    const withChoiceMorning = group.filter((u) => u.shiftChoice === "morning");
    const withChoiceNight = group.filter((u) => u.shiftChoice === "night");
    const noChoice = group.filter((u) => !u.shiftChoice);

    const targetMorningCount = Math.ceil(group.length / 2);
    const remainingMorningCount = targetMorningCount - withChoiceMorning.length;

    const shuffledNoChoice = shuffleArray(noChoice);
    const assignedMorning = [
      ...withChoiceMorning,
      ...shuffledNoChoice.slice(0, remainingMorningCount),
    ];
    const assignedNight = [
      ...withChoiceNight,
      ...shuffledNoChoice.slice(remainingMorningCount),
    ];

    return { morning: assignedMorning, night: assignedNight };
  };

  const arbeiterSplit = splitShiftBalanced(groupByTeam("sozialarbeiter"));
  const betreuerSplit = splitShiftBalanced(groupByTeam("sozialbetreuer"));
  const betreuerhelferSplit = splitShiftBalanced(
    groupByTeam("sozialbetreuerhelfer")
  );

  const assignShifts = (users, shiftInfo, offsets, patternType) => {
    users.forEach((user, userIndex) => {
      const cycleLength = patternType === "betreuer" ? 6 : 4;
      const offset =
        Array.isArray(offsets) && offsets[userIndex] != null
          ? offsets[userIndex]
          : (userIndex + offsets) % cycleLength;

      for (let day = 1; day <= DAYS; day++) {
        const currentDate = new Date(startDay);
        currentDate.setDate(day);

        let isWorkingDay = true;

        if (patternType === "arbeiter") {
          const cycleDay = (day - 1 + offset) % 4;
          if (cycleDay === 0) isWorkingDay = false;
        }

        if (patternType === "betreuer") {
          const cycleDay = (day - 1 + offset) % 6;
          if (cycleDay === 4 || cycleDay === 5) isWorkingDay = false;
        }

        if (!isWorkingDay) continue;

        const shiftStart = new Date(currentDate);
        shiftStart.setHours(shiftInfo.startHour, shiftInfo.startMinute, 0, 0);

        const shiftEnd = new Date(currentDate);
        shiftEnd.setHours(shiftInfo.endHour, shiftInfo.endMinute, 0, 0);

        allShifts.push({
          id: idCounter++,
          title: user.name,
          uid: user._id,
          start: formatDate(shiftStart),
          end: formatDate(shiftEnd),
          calendarId: user.workType === "part-time" ? "partTime" : user.team,
        });
      }
    });
  };

  assignShifts(arbeiterSplit.morning, SHIFTS[0], 0, "arbeiter");
  assignShifts(arbeiterSplit.night, SHIFTS[1], 0, "arbeiter");
  assignShifts(
    betreuerSplit.morning,
    SHIFTS[0],
    arbeiterSplit.morning.length + arbeiterSplit.night.length,
    "betreuer"
  );
  assignShifts(
    betreuerSplit.night,
    SHIFTS[1],
    arbeiterSplit.morning.length + arbeiterSplit.night.length,
    "betreuer"
  );

  const customOffsetsMorning = [0, 2, 4];
  const customOffsetsNight = [0, 2, 4];

  assignShifts(
    betreuerhelferSplit.morning,
    SHIFTS[0],
    customOffsetsMorning,
    "betreuer"
  );
  assignShifts(
    betreuerhelferSplit.night,
    SHIFTS[1],
    customOffsetsNight,
    "betreuer"
  );

  return allShifts;
}

function formatDate(date) {
  return date.toISOString().replace("T", " ").substring(0, 16);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default createMockData;
