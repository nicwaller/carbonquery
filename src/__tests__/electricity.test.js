const math = require('mathjs');
const electricity = require('../electricity');

describe('Electricity', () => {
  test('electricity', () => {
    const kWh = math.unit(1, 'kWh');
    const derivedEmissions = electricity.emissionsForElectricalEnergy(kWh, electricity.plant.coal);
    const expectedEmissions = math.unit(576, 'g');
    const difference = math.abs(math.subtract(derivedEmissions, expectedEmissions));
    expect(difference.toNumber('kg')).toBeLessThan(0.01);
  });
});

// Maybe later do I want to return a timeseries that also accounts for embodied energy?
