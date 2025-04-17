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
    { name: "Sabah", startHour: 8, startMinute: 0, endHour: 16, endMinute: 30 },
    {
      name: "Öğlen",
      startHour: 13,
      startMinute: 30,
      endHour: 22,
      endMinute: 0,
    },
  ];

  const MAX_SHIFTS_PER_PERSON = 21;
  const MAX_SHIFTS_PARTTIME = 12;

  const people = allUsers
    .filter((user) => user.isActive)
    .map((user) => ({
      id: user._id,
      name: user.name,
      calendarId: user.workType === "part-time" ? "partTime" : user.team,
      isPartTime: user.workType === "part-time",
    }));

  const betreuer = shuffleArray(
    people.filter(
      (p) => p.calendarId === "sozialbetreuer" || p.calendarId === "partTime"
    )
  );
  const arbeiter = shuffleArray(
    people.filter((p) => p.calendarId === "sozialarbeiter")
  );

  const shiftCount = {};
  const weeklyShiftCount = {};
  people.forEach((p) => {
    shiftCount[p.name] = 0;
    weeklyShiftCount[p.name] = {};
  });

  const betreuerIndex = { value: 0 };
  const arbeiterIndex = { value: 0 };

  const allShifts = [];
  let idCounter = 1;
  const totalWeeks = Math.ceil(DAYS / 7);

  for (let day = 0; day < DAYS; day++) {
    const currentDate = new Date(startDay);
    currentDate.setDate(startDay.getDate() + day);
    const currentWeek = getWeekNumberInMonth(currentDate);

    const assignedToday = new Set();
    const partTimeAssignedTodayRef = { value: false }; // 🔹 Günlük part-time kontrolü

    for (const shift of SHIFTS) {
      const selectedBetreuer = selectPeople(
        betreuer,
        betreuerIndex,
        4,
        assignedToday,
        shiftCount,
        weeklyShiftCount,
        currentWeek,
        totalWeeks,
        MAX_SHIFTS_PER_PERSON,
        MAX_SHIFTS_PARTTIME,
        partTimeAssignedTodayRef
      );

      const selectedArbeiter = selectPeople(
        arbeiter,
        arbeiterIndex,
        2,
        assignedToday,
        shiftCount,
        weeklyShiftCount,
        currentWeek,
        totalWeeks,
        MAX_SHIFTS_PER_PERSON,
        MAX_SHIFTS_PARTTIME,
        partTimeAssignedTodayRef
      );

      const selected = [...selectedBetreuer, ...selectedArbeiter];

      for (const person of selected) {
        const shiftStart = new Date(currentDate);
        shiftStart.setHours(shift.startHour, shift.startMinute, 0, 0);

        const shiftEnd = new Date(currentDate);
        shiftEnd.setHours(shift.endHour, shift.endMinute, 0, 0);

        allShifts.push({
          id: idCounter++,
          title: person.name,
          uid: person.id,
          start: formatDate(shiftStart),
          end: formatDate(shiftEnd),
          calendarId: person.calendarId,
        });
      }
    }
  }

  return allShifts;
}

// 🔧 Yardımcı Fonksiyonlar

function shuffleArray(arr) {
  return arr.slice().sort(() => 0.5 - Math.random());
}

function selectPeople(
  arr,
  indexObj,
  count,
  assignedToday,
  shiftCount,
  weeklyShiftCount,
  currentWeek,
  totalWeeks,
  maxShifts,
  maxShiftsPartTime,
  partTimeAssignedTodayRef
) {
  const selected = [];
  let tries = 0;

  while (selected.length < count && tries < arr.length * 2) {
    const person = arr[indexObj.value];
    indexObj.value = (indexObj.value + 1) % arr.length;
    tries++;

    const maxAllowed = person.isPartTime ? maxShiftsPartTime : maxShifts;
    const personTotal = shiftCount[person.name];
    const personWeekly = weeklyShiftCount[person.name][currentWeek] || 0;
    const maxWeekly = Math.ceil(maxAllowed / totalWeeks);

    if (person.isPartTime && partTimeAssignedTodayRef.value) {
      continue; // ❌ Aynı gün ikinci part-time atanamaz
    }

    if (
      personTotal < maxAllowed &&
      personWeekly < maxWeekly &&
      !assignedToday.has(person.name)
    ) {
      selected.push(person);
      assignedToday.add(person.name);

      if (person.isPartTime) {
        partTimeAssignedTodayRef.value = true;
      }

      shiftCount[person.name]++;
      weeklyShiftCount[person.name][currentWeek] = personWeekly + 1;
    }
  }

  return selected;
}

function formatDate(date) {
  return date.toISOString().replace("T", " ").substring(0, 16);
}

function getWeekNumberInMonth(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const offset = start.getDay();
  return Math.floor((dayOfMonth + offset - 1) / 7);
}

export default createMockData;
