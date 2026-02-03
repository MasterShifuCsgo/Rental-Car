const { describe, expect, test } = require('@jest/globals');
const CarRentalPricing = require('../rentalPrice.js')

describe('CarRentalPricing', () => {
  let pricing

  beforeEach(() => {
    pricing = new CarRentalPricing()
  })

  describe('age validation', () => {
    test('throws if driver is under 18', () => {
      expect(() =>
        pricing.price(
          new Date('2024-01-01'),
          new Date('2024-01-02'),
          'Compact',
          17
        )
      ).toThrow('Driver too young - cannot quote the price')
    })

    test('throws if driver is 21 or younger and car is not Compact', () => {
      expect(() =>
        pricing.price(
          new Date('2024-01-01'),
          new Date('2024-01-02'),
          'Racer',
          21
        )
      ).toThrow('Drivers 21 y/o or less can only rent Compact vehicles')
    })
  })

  describe('getCarClass', () => {
    test('returns valid car class', () => {
      expect(pricing.getCarClass('Compact')).toBe('Compact')
      expect(pricing.getCarClass('Electric')).toBe('Electric')
      expect(pricing.getCarClass('Cabrio')).toBe('Cabrio')
      expect(pricing.getCarClass('Racer')).toBe('Racer')
    })

    test('returns Unknown for unsupported car class', () => {
      expect(pricing.getCarClass('Truck')).toBe('Unknown')
    })
  })

  describe('getRentalPeriod', () => {
    test('calculates rental period including both pickup and dropoff days', () => {
      const days = pricing.getRentalPeriod(
        new Date('2024-01-01'),
        new Date('2024-01-03')
      )
      expect(days).toBe(3)
    })

    test('works regardless of date order', () => {
      const days = pricing.getRentalPeriod(
        new Date('2024-01-05'),
        new Date('2024-01-01')
      )
      expect(days).toBe(5)
    })
  })

  describe('getSeason', () => {
    test('returns Low season when dates are outside high season', () => {
      const season = pricing.getSeason(
        new Date('2024-01-10'), // January
        new Date('2024-01-15')
      )
      expect(season).toBe('Low')
    })

    test('returns High season when pickup is in high season', () => {
      const season = pricing.getSeason(
        new Date('2024-06-01'), // June
        new Date('2024-06-05')
      )
      expect(season).toBe('High')
    })

    test('returns High season when dropoff is in high season', () => {
      const season = pricing.getSeason(
        new Date('2024-04-28'), // March
        new Date('2024-05-02')  // April
      )
      expect(season).toBe('High')
    })
  })

  describe('price calculation', () => {
    test('calculates base price correctly in low season', () => {
      // age * rentalPeriod = 30 * 3 = 90
      const price = pricing.price(
        new Date('2024-01-01'),
        new Date('2024-01-03'),
        'Compact',
        30
      )
      expect(price).toBe('$90')
    })

    test('applies high season surcharge', () => {
      // base = 40 * 2 = 80
      // high season => 80 * 1.15 = 92
      const price = pricing.price(
        new Date('2024-07-10'),
        new Date('2024-07-11'),
        'Compact',
        40
      )
      expect(price).toBe('$92')
    })


    test('applies racer young driver high season premium', () => {
      // base = 25 * 1 = 50
      // racer + age <= 25 + high => *1.5 = 75
      // high season => *1.15 = 86.25
      const price = pricing.price(
        new Date('2024-07-01'),
        new Date('2024-07-02'),
        'Racer',
        25
      )
      expect(price).toBe('$86.25')
    })

    test('applies long rental discount in low season', () => {
      // rentalPeriod = 11
      // base = 40 * 11 = 440
      // low season + >10 days => *0.9 = 396
      const price = pricing.price(
        new Date('2024-02-01'),
        new Date('2024-02-11'),
        'Compact',
        40
      )
      expect(price).toBe('$396')
    })
  })
})
