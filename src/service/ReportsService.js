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
      infected: `${parseFloat(percentageInfected.toFixed(2))}%`, 
      notInfected: `${parseFloat(percentageNotInfected.toFixed(2))}%`
    }
  }
  async itemsAverage ({ survivorsCount }) {
    let countWater = await this.db.column().from('inventory')
    .sum('inventory.quantity')
    .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
    .where('survivors.infected', 0)
    .andWhere('inventory.item_id', 1)

    let countFood = await this.db.column().from('inventory')
      .sum('inventory.quantity')
      .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
      .where('survivors.infected', 0)
      .andWhere('inventory.item_id', 2)
  
    let countMedication = await this.db.column().from('inventory')
      .sum('inventory.quantity')
      .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
      .where('survivors.infected', 0)
      .andWhere('inventory.item_id', 3)
    
    let countAmmunition = await this.db.column().from('inventory')
      .sum('inventory.quantity')
      .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
      .where('survivors.infected', 0)
      .andWhere('inventory.item_id', 4)

    return {
      averageWater: parseFloat((countWater[0]['sum(`inventory`.`quantity`)'] / survivorsCount).toFixed(2)),
      averageFood: parseFloat((countFood[0]['sum(`inventory`.`quantity`)'] / survivorsCount).toFixed(2)),
      averageMedication: parseFloat((countMedication[0]['sum(`inventory`.`quantity`)'] / survivorsCount).toFixed(2)),
      averageAmmunition: parseFloat((countAmmunition[0]['sum(`inventory`.`quantity`)'] / survivorsCount).toFixed(2))
    }
  }
  async lostPoints () {
    let result = await this.db
    .raw(`Select sum(items.points * inventory.quantity) 
      from inventory 
      LEFT JOIN items ON items.id = inventory.item_id 
      LEFT JOIN survivors ON survivors.id = inventory.survivor_id 
      where survivors.infected = 1`)
    return result[0][0]['sum(items.points * inventory.quantity)'] || 0
  }
  async percentages() {
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
    let lostPoints = await this.lostPoints();
    let averageProperties = await this.itemsAverage({ survivorsCount: survivorsCount["count(`survivors`.`id`)"] })
    return {
      calculatePercentage,
      averageProperties,
      lostPoints
    }
  }
}

module.exports = Reports