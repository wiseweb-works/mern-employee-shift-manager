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

  // Kullanıcıları filtrele
  const arbeiter = allUsers
    .filter((u) => u.isActive && u.team === "sozialarbeiter")
    .sort((a, b) => a.name.localeCompare(b.name));

  const betreuer = allUsers
    .filter(
      (u) =>
        u.isActive &&
        (u.team === "sozialbetreuer" || u.workType === "part-time")
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Sabah/akşam ayrımı
  const arbeiterMorning = arbeiter.slice(0, Math.ceil(arbeiter.length / 2));
  const arbeiterNight = arbeiter.slice(Math.ceil(arbeiter.length / 2));
  const betreuerMorning = betreuer.slice(0, Math.ceil(betreuer.length / 2));
  const betreuerNight = betreuer.slice(Math.ceil(betreuer.length / 2));

  // Vardiya atama fonksiyonu
  const assignShifts = (users, shiftInfo, startOffset, patternType) => {
    users.forEach((user, userIndex) => {
      const cycleLength = patternType === "betreuer" ? 6 : 4;
      const offset = (userIndex + startOffset) % cycleLength;

      for (let day = 1; day <= DAYS; day++) {
        const currentDate = new Date(startDay);
        currentDate.setDate(day);

        let isWorkingDay = true;

        if (patternType === "arbeiter") {
          // 4 günde 1 izin
          const cycleDay = (day - 1 + offset) % 4;
          if (cycleDay === 0) isWorkingDay = false;
        }

        if (patternType === "betreuer") {
          // 6 günde 4 çalış, 2 izin (izin günleri cycleDay 4 ve 5)
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

  // Vardiyaları ata
  assignShifts(arbeiterMorning, SHIFTS[0], 0, "arbeiter");
  assignShifts(arbeiterNight, SHIFTS[1], 0, "arbeiter");
  assignShifts(betreuerMorning, SHIFTS[0], arbeiter.length, "betreuer");
  assignShifts(betreuerNight, SHIFTS[1], arbeiter.length, "betreuer");

  return allShifts;
}

// Yardımcı tarih formatlayıcı
function formatDate(date) {
  return date.toISOString().replace("T", " ").substring(0, 16);
}

export default createMockData;
