const math = require('mathjs');
// const logger = require('pino')();
// const rootLogger = require('pino')();
const combustion = require('./combustion');

// const logger = rootLogger.child({ file: 'electricity' });

// Do I need to factor in assumptions like line losses over distance?
// That would be a separate query -- emissions at point of production vs. emissions for
// a given amount used at point of delivery.

// The thermal energy content of coal is 6,150 kWh/ton. Although coal fired power generators are
// very efficient, they are still limited by the laws of thermodynamics. Only about 40 percent of
// the thermal energy in coal is converted to electricity.

// I need to return either/or marginal emissions or amortized (including embodied energy)
// otherwise for solar and wind I would just return 0, I guess?

/**
 * Electricity is produced by power plants. Some of them burn fuel.
 */
class PowerPlant {
  // This would be an abstract class, I suppose.
}

// Coal plant -> Thermal power station -> Power plant
// TODO: generalize fuel-thermal power plant with a constructor that takes a fuel and thermal efficiency
class CoalPlant extends PowerPlant {
  constructor() {
    super();
    this.thermalEfficiency = 0.46;
  }

  emissionsForElectricalEnergy(electricalEnergy) {
    const heatEnergy = math.divide(electricalEnergy, this.thermalEfficiency);
    // logger.info(heatEnergy.format());
    return combustion.fuels.coal.emissionsByHeatEnergy(heatEnergy).to('g');
  }
}

// thermal efficiency
// and a large coal-fueled electrical generating plant peaks at about 46%,
function emissionsForElectricalEnergy(electricalEnergy, powerplant) {
  // logger.info(electricalEnergy);
  // logger.info(powerplant);
  return powerplant.emissionsForElectricalEnergy(electricalEnergy).to('g');
}

const plant = {
  // TODO: this is the place where I should account for thermal efficiency
  coal: new CoalPlant(),
};

module.exports.emissionsForElectricalEnergy = emissionsForElectricalEnergy;
module.exports.plant = plant;
