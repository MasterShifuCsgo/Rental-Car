function price(pickupDate, dropoffDate, type, age, licenseYears) {  
  const days = get_days(pickupDate, dropoffDate);
  const season = getSeason(pickupDate);

  if (age < 18) {
    return "Driver too young - cannot quote the price";
  }   

  if (age <= 21 && type !== "Compact") {
    return "Drivers 21 y/o or less can only rent Compact vehicles";
  }

  if (licenseYears < 1) {
    return "Driver must have a license for at least 1 year";
  }

  // base price: minimum per day = driver's age
  let rentalprice = 0;
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(pickupDate);

  for (let i = 0; i < days; i++) {
    const currentDay = new Date(firstDate.getTime() + i * oneDay);
    let daily = age; // base price per day

    // Weekend pricing (+5%)
    if (isWeekend(currentDay)) {
      daily *= 1.05;
    }

    // Racer, young driver (+50%, only High season)
    if (type === "Racer" && age <= 25 && season === "High") {
      daily *= 1.5;
    }

    // High season (+15%)
    if (season === "High") {
      daily *= 1.15;
    }

    // License < 2 years (+30%)
    if (licenseYears < 2) {
      daily *= 1.30;
    }

    // License < 3 years in High season (+15 EUR per day)
    if (licenseYears < 3 && season === "High") {
      daily += 15;
    }

    rentalprice += daily;
  }

  // Long rental discount: >10 days, only Low season (-10%)
  if (days > 10 && season === "Low") {
    rentalprice *= 0.9;
  }

  return '$' + rentalprice.toFixed(2);
}

function get_days(pickupDate, dropoffDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(pickupDate);
  const secondDate = new Date(dropoffDate);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate) {
  const month = new Date(pickupDate).getMonth(); // 0 = Jan
  return (month >= 3 && month <= 9) ? "High" : "Low"; // Apr–Oct = High
}

function isWeekend(date) {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
}

exports.price = price;