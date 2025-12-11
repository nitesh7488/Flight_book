import prisma from "../src/prismaClient";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

// Generates 10 departure times each day
function generateDailyTimes() {
  const times = [];
  for (let i = 0; i < 10; i++) {
    times.push({ hour: randomInt(5, 23), min: randomInt(0, 59) });
  }
  return times;
}

async function main() {
  const today = new Date();
  const totalDays = 120; // 4 months

  const cities = [
    "Delhi","Mumbai","Bangalore","Chennai","Kolkata","Hyderabad",
    "Pune","Goa","Jaipur","Ahmedabad","Kochi","Lucknow"
  ];

  const airlines = [
    { name: "IndiGo", logo: "/airlines/indigo.png", code: "6E" },
    { name: "Air India", logo: "/airlines/airindia.png", code: "AI" },
    { name: "Vistara", logo: "/airlines/vistara.png", code: "UK" },
    { name: "SpiceJet", logo: "/airlines/spicejet.png", code: "SG" },
    { name: "AirAsia India", logo: "/airlines/airasia.png", code: "I5" },
    { name: "Air India Express", logo: "/airlines/express.png", code: "IX" }
  ];

  const flightsData: any[] = [];

  for (let fromCity of cities) {
    for (let toCity of cities) {
      if (fromCity === toCity) continue;

      for (let d = 0; d < totalDays; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() + d);

        const times = generateDailyTimes();

        times.forEach(({ hour, min }) => {
          const airline = randomItem(airlines);

          const departure = new Date(date);
          departure.setHours(hour, min, 0);

          const durationMin = randomInt(60,240);
          const arrival = new Date(departure.getTime() + durationMin*60000);

          const price = Math.max(
            2000 + durationMin * randomInt(12,18) + randomInt(-200,500),
            1700
          );

          flightsData.push({
            fromCity,
            toCity,
            departureTime: departure,
            arrivalTime: arrival,
            airlineName: airline.name,
            airlineLogoUrl: airline.logo,
            flightNumber: `${airline.code}-${randomInt(100,999)}`,
            durationMin,
            price,
          });
        });
      }
    }
  }

  console.log(`⏳ Seeding about ${flightsData.length} flights...`);
  await prisma.flight.createMany({ data: flightsData });
  console.log(`✨ Successfully created flights from TODAY → next 4 months!`);
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
