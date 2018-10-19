const math = require('mathjs');
const combustion = require('../combustion');

describe('Coal', () => {
  const { coal } = combustion.fuels;

  test('reasonable carbon content', () => {
    expect(coal.contentCarbon).toBe(0.65);
    expect(coal.contentCO2).toBeGreaterThan(2.38);
    expect(coal.contentCO2).toBeLessThan(2.39);
  });

  test('emissions by mass', () => {
    const lump = math.unit(5000, 'g');
    const emissions = coal.combust(lump);
    expect(emissions.toNumber()).toBeGreaterThan(11900);
    expect(emissions.toNumber()).toBeLessThan(12000);

    // This is good, but insufficient. How can I check the unit prefix? <k>g?
    expect(emissions.equalBase(math.unit(0, 'g'))).toBe(true);
  });

  test('emissions by heat energy', () => {
    // It takes around 67,500 Joules to brown a single slice of toast
    const toast = math.unit(67500.0, 'J');
    const emissions = coal.emissionsByHeatEnergy(toast);
    expect(emissions.toNumber()).toBeGreaterThan(4.9);
    expect(emissions.toNumber()).toBeLessThan(5.0);
    expect(emissions.equalBase(math.unit(0, 'g'))).toBe(true);
  });
});
