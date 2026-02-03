const assert = require('assert/strict')

class CarRentalPricing {

  highMonthRange = { start: 4, end: 10 } // from 0 to 11

  price(pickupDate, dropoffDate, type, age) {        
    
    const carClass = this.getCarClass(type)
    const rentalPeriod = this.getRentalPeriod(pickupDate, dropoffDate)
    const season = this.getSeason(pickupDate, dropoffDate)    

    if (age < 18) {
      throw new Error('Driver too young - cannot quote the price')
    }

    if (age <= 21 && carClass !== 'Compact') {
      throw new Error('Drivers 21 y/o or less can only rent Compact vehicles')
    }

    const defaultRentPrice = age * rentalPeriod    
    const rentalPrice = this.getRentalPrice({
      defaultRentPrice,
      season,
      carClass,
      rentalPeriod,
      age,
    })
    
    return '$' + rentalPrice;
  }

  getRentalPrice({ defaultRentPrice, season, carClass, rentalPeriod, age }) {    

    if (carClass === 'Racer' && age <= 25 && season === 'High') {
      defaultRentPrice *= 1.5
    }

    if (season === 'High') {
      defaultRentPrice *= 1.15
    }

    if (rentalPeriod > 10 && season === 'Low') {
      defaultRentPrice *= 0.9
    }    

    return defaultRentPrice
  }

  getCarClass(type) {
    switch (type) {
      case 'Compact':
      case 'Electric':
      case 'Cabrio':
      case 'Racer':
        return type
      default:
        return 'Unknown'
    }
  }

  getRentalPeriod(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000
    const firstDate = new Date(pickupDate)
    const secondDate = new Date(dropoffDate)

    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1
  }

  getSeason(pickupDate, dropoffDate) {
    
    const isHighMonth = (month) => {      
      return this.highMonthRange.start <= month && month <= this.highMonthRange.end
    }

    assert(this.highMonthRange.start >= 0 && this.highMonthRange.end < 12)

    const pickupMonth = pickupDate.getMonth()
    const dropoffMonth = dropoffDate.getMonth()

    const isHighSeason =
      isHighMonth(pickupMonth) ||
      isHighMonth(dropoffMonth) ||
      (pickupMonth < this.highMonthRange.start && this.highMonthRange.end < dropoffMonth)

    return isHighSeason ? 'High' : 'Low'
  }
}

module.exports = CarRentalPricing