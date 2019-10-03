'use strict'
const utilsTrade = require('../utils/trade');
class TradeService {
  constructor(db) {
    this.db = db
    this.utilsTrade = new utilsTrade();
  }
  async show({ survivor_id, item_id }) {
    let inventory = await this.db.column([
        'inventory.quantity',
        'inventory.survivor_id',
        'items.name',
        'items.points',
        'survivors.infected'
      ]).from('inventory')
      .leftJoin('survivors', 'survivors.id', survivor_id)
      .leftJoin('items', 'items.id', 'inventory.item_id')
      .where('survivor_id', survivor_id)
      .andWhere('items.id', item_id);
    return inventory[0]
  }
  async changeInventory ({ item_id, survivor_id }) {
    let item = await this.db('inventory')
      .where({ item_id, survivor_id })
    return item
  }
  async tradeItems({ from, per }) {
    let currentSurvivor = await this.show(from);
    let otherSurvivor = await this.show(per);

    if (currentSurvivor.hasOwnProperty('infected') && 
        currentSurvivor.infected ||
        otherSurvivor.hasOwnProperty('infected') &&
        otherSurvivor.infected
      ) {
      throw { message: 'User Infected, can not trade', status: 400 }
    }

    if (from.quantity > currentSurvivor.quantity ||
      per.quantity > otherSurvivor.quantity
      ) {
      throw { message: 'Quantity id big', status: 500 }
    }

    if (this.utilsTrade.isPossible({ currentSurvivor, otherSurvivor })) {
      let log = await this.changeInventory({ 
        item_id: per.item_id, 
        survivor_id: from.survivor_id 
      })
      console.log(log)
      return true
    } else {
      throw { messsage: 'Not possible themselves items', status: 400 }
    }
  }
}

module.exports = TradeService