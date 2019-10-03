'use strict'

class Reports  {
  constructor(db) {
    this.db = db
  }
  async survivorsInfected() {
    let result = await this.db('survivors')
      .count('survivors.id')
      .where('survivors.infected', true);
    return result[0]
  }
  async survivorsNotInfected() {
    let result = await this.db('survivors')
      .count('survivors.id')
      .where('survivors.infected', false);
    return result[0]
  }
  async show() {
    let result = await this.db('survivors').count('survivors.id');
    return result[0]
  }
  async calculatePercentage({ total, survivorsInfected, survivorsNotInfected }) {
    let percentageInfected = (100*survivorsInfected)/total;
    let percentageNotInfected = 100 - percentageInfected
    return {  
      infected: `${percentageInfected}%`, 
      notInfected: `${percentageNotInfected}%`
    }
  }
  async infectedPercentage() {
    let survivorsInfected = await this.survivorsInfected();
    let survivorsNotInfected = await this.survivorsNotInfected();
    let survivorsCount = await this.show();

    let calculatePercentage = await this.calculatePercentage(
      { 
        total: survivorsCount["count(`survivors`.`id`)"],
        survivorsInfected: survivorsInfected["count(`survivors`.`id`)"],
        survivorsNotInfected: survivorsNotInfected["count(`survivors`.`id`)"]
      }
    )
    return calculatePercentage
  }
}

module.exports = Reports