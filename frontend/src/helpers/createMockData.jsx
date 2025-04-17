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

  const people = allUsers.map((user) => ({
    id: user._id,
    name: user.name,
    calendarId: user.team,
  }));

  const betreuer = shuffleArray(
    people.filter((p) => p.calendarId === "sozialbetreuer")
  );
  const arbeiter = shuffleArray(
    people.filter((p) => p.calendarId === "sozialarbeiter")
  );

  const betreuerIndex = { value: 0 };
  const arbeiterIndex = { value: 0 };

  const shiftCount = {};
  people.forEach((p) => {
    shiftCount[p.name] = 0;
  });

  let idCounter = 1;
  const allShifts = [];

  for (let d = 0; d < DAYS; d++) {
    const date = new Date(startDay);
    date.setDate(startDay.getDate() + d);
    const assignedToday = new Set();

    for (let shift of SHIFTS) {
      const selectedBetreuer = selectSequential(
        betreuer,
        betreuerIndex,
        4,
        assignedToday,
        shiftCount,
        MAX_SHIFTS_PER_PERSON
      );
      const selectedArbeiter = selectSequential(
        arbeiter,
        arbeiterIndex,
        2,
        assignedToday,
        shiftCount,
        MAX_SHIFTS_PER_PERSON
      );

      const selected = [...selectedBetreuer, ...selectedArbeiter];

      for (let person of selected) {
        shiftCount[person.name]++;
        assignedToday.add(person.name);

        const shiftDate = new Date(date);
        const start = new Date(
          shiftDate.setHours(shift.startHour, shift.startMinute, 0, 0)
        );
        const end = new Date(
          shiftDate.setHours(shift.endHour, shift.endMinute, 0, 0)
        );

        allShifts.push({
          id: idCounter++,
          title: person.name,
          uid: person.id,
          start: formatDate(start),
          end: formatDate(end),
          calendarId: person.calendarId,
        });
      }
    }
  }

  return allShifts;
}

function shuffleArray(arr) {
  return arr.slice().sort(() => 0.5 - Math.random());
}

function selectSequential(
  arr,
  indexObj,
  count,
  assignedToday,
  shiftCount,
  maxShifts
) {
  const result = [];
  let tries = 0;

  while (result.length < count && tries < arr.length * 2) {
    const person = arr[indexObj.value];
    indexObj.value = (indexObj.value + 1) % arr.length;

    if (
      shiftCount[person.name] < maxShifts &&
      !assignedToday.has(person.name)
    ) {
      result.push(person);
      assignedToday.add(person.name);
    }

    tries++;
  }

  return result;
}

function formatDate(date) {
  return date.toISOString().replace("T", " ").substring(0, 16);
}

export default createMockData;
