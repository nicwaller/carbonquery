const math = require('mathjs');
const logger = require('pino')();

// TODO: redo this in Typescript

// Best to specify a particular resource
// Otherwise, specify a geographic point
// Focus on units

// Or just go with the provincial mix, like
// NOTE: Year average numbers for Ontario Hydro Energy range from
// 850 to 890 kg/MWh depending on coal, oil and natural gas mix.
// https://www.nrcan.gc.ca/energy/efficiency/industry/technical-info/benchmarking/canadian-steel-industry/5193
// CO2 vs 'carbon' (mol/kg)


/**
 * There is a definite relationship between carbon content and heating value, but there are complicating
 * factors like hydrogen and moisture content that make it impossible to derive heating value based on
 * carbon content alone. Instead, we build up tables of known heating values for familiar fuels.
 */
class Fuel {
  constructor(carbonContent, heatingValue) {
    this.setCarbonContent(carbonContent);
    this.setHeatingValue(heatingValue);
  }

  setCarbonContent(massRatio) {
    this.contentCarbon = massRatio;

    // Because the atomic weight of carbon is 12 and that of oxygen is 16, the atomic weight of carbon dioxide is 44.
    // Based on that ratio, and assuming complete combustion, 1 pound of carbon combines with 2.667 pounds of oxygen
    // to produce 3.667 pounds of carbon dioxide.
    // Source: https://www.eia.gov/coal/production/quarterly/co2_article/co2.html
    // TODO: move this into combustion.js
    const carbonCO2Ratio = 44 / 12;
    this.contentCO2 = massRatio * carbonCO2Ratio;
  }

  // The stored energy potential within coal is described as the “calorific value,” “heating value” or “heat content.”
  // Source: https://www.thebalance.com/all-types-of-coal-are-not-created-equal-1182543

  // The heating value (or energy value or calorific value) of a substance, usually a fuel
  // or food (see food energy), is the amount of heat released during the combustion of a specified amount of it.
  // Source: https://en.wikipedia.org/wiki/Heat_of_combustion
  setHeatingValue(heatingUnitValue) {
    this.heatingValue = heatingUnitValue;
  }

  getCarbonContent() {
    return this.contentCarbon;
  }

  getCO2Content() {
    return this.contentCO2;
  }

  combust(mass) {
    return math.multiply(mass, this.contentCO2).to('g');
  }

  emissionsByHeatEnergy(energy) {
    // First, how much mass needs to be combusted to produce that energy?
    const mass = math.divide(energy, this.heatingValue);
    logger.info(mass.toString());
    return this.combust(mass).to('g');
  }
}

// TODO: return values for CO2, CH4, ..., and CO2e
// Also return assumed GWP warming values and/or outlook timeframe for non-CO2 numbers

class Coal extends Fuel {
  constructor() {
    // More heating values here:
    // http://www.world-nuclear.org/information-library/facts-and-figures/heat-values-of-various-fuels.aspx
    super(0.65, math.unit(32373, 'J/g'));
  }
}

const fuels = {
  coal: new Coal(),
};


// Different 'ranks' of coal have different heating values and contain different amounts of carbon
// Bituminous coal contains 45%–86% carbon and is used to generate electricity
// Source: https://www.eia.gov/energyexplained/print.php?page=coal_home
// TODO: pick a 'generic' coal if no more detail is provided
// const carbonContent = {
//   anthraciteCoal: math.unit(0.91, 'ton/ton'),
//   bituminousCoal: math.unit(0.65, 'ton/ton'),
// };

// const cO2Content = {
//   // roughly 3 tons of CO2 per ton of fully combusted coal
//   anthraciteCoal: math.multiply(carbonContent.anthraciteCoal, carbonCO2Ratio),
//   bituminousCoal: math.multiply(carbonContent.bituminousCoal, carbonCO2Ratio),
// };

// const combustionHeatingValue = {
//   coal: math.unit(32373, 'MJ/ton'), // Source:
// https://www.nrcan.gc.ca/energy/efficiency/industry/technical-info/benchmarking/canadian-steel-industry/5193
// }

// const emissionFactorsC02 = {
//   coal: math.unit(0.093, 'kg/MJ'),
//   naturalGas: math.unit(0.056, 'kg/MJ'),
// };

// function combustionEmissions(qty, unit = 'g') {
//   const fuel = fuels.coal;
//   const combustedMass = math.unit(qty, 'kg');
//   const emissions = math.multiply(combustedMass, cO2Content.anthraciteCoal);
//   return { emissions: emissions.to(unit).format({ precision: 7 }) };
// }

// TODO: return the heating value / calorific value used in this calculation

// module.exports.combustionEmissions = combustionEmissions;
module.exports.fuels = fuels;
