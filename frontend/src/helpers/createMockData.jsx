export function generateShifts() {
  const today = new Date();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const DAYS = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const SHIFTS = [
    { name: "Sabah", startHour: 8, endHour: 14 },
    { name: "Öğlen", startHour: 14, endHour: 20 },
  ];
  const MAX_SHIFTS_PER_PERSON = 21;
  const TOTAL_BETREUER = 14;
  const TOTAL_ARBEITER = 7;

  const people = [
    ...Array.from({ length: TOTAL_BETREUER }, (_, i) => ({
      name: `Person ${i + 1}`,
      calendarId: "sozialbetreuer",
    })),
    ...Array.from({ length: TOTAL_ARBEITER }, (_, i) => ({
      name: `Person ${i + 1 + TOTAL_BETREUER}`,
      calendarId: "sozialarbeiter",
    })),
  ];

  const betreuer = people.filter((p) => p.calendarId === "sozialbetreuer");
  const arbeiter = people.filter((p) => p.calendarId === "sozialarbeiter");

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
      const availableBetreuer = betreuer.filter(
        (p) =>
          shiftCount[p.name] < MAX_SHIFTS_PER_PERSON &&
          !assignedToday.has(p.name)
      );
      const selectedBetreuer = getRandom(availableBetreuer, 4);

      const availableArbeiter = arbeiter.filter(
        (p) =>
          shiftCount[p.name] < MAX_SHIFTS_PER_PERSON &&
          !assignedToday.has(p.name)
      );
      const selectedArbeiter = getRandom(availableArbeiter, 2);

      const selected = [...selectedBetreuer, ...selectedArbeiter];

      for (let person of selected) {
        shiftCount[person.name]++;
        assignedToday.add(person.name);

        const shiftDate = new Date(date);
        const start = new Date(shiftDate.setHours(shift.startHour, 0, 0, 0));
        const end = new Date(shiftDate.setHours(shift.endHour, 0, 0, 0));

        allShifts.push({
          id: idCounter++,
          title: person.name,
          start: formatDate(start),
          end: formatDate(end),
          calendarId: person.calendarId,
        });
      }
    }
  }

  return allShifts;
}

// async function fetchPeopleData() {
//   try {
//     // API çağrısını yap
//     const response = await fetch("https://your-api-endpoint.com/people");
//     if (!response.ok) {
//       throw new Error("API isteği başarısız oldu");
//     }

//     // API'den gelen veriyi JSON'a çevir
//     const data = await response.json();

//     // Veriyi istediğiniz formata dönüştürün
//     return data.map((person, index) => ({
//       name: person.name,
//       calendarId: person.calendarId,
//     }));
//   } catch (error) {
//     console.error("Veri çekme hatası:", error);
//     return []; // Hata durumunda boş bir dizi döndür
//   }
// }

function getRandom(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

function formatDate(date) {
  return date.toISOString().replace("T", " ").substring(0, 16);
}

const createMockData = () => {
  return generateShifts();
};

export default createMockData;
