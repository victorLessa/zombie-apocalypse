'use strict'
const utilsTrade = require('../utils/trade');
class TradeService {
  constructor(db) {
    this.db = db
  }
  async show({ survivor_id, item_id }) {
    let inventory = await this.db.column([
        'inventory.quantity',
        'inventory.survivor_id',
        'items.name',
        'items.points'
      ]).from('inventory')
      .leftJoin('items', 'items.id', 'inventory.item_id')
      .where('survivor_id', survivor_id)
      .andWhere('items.id', item_id);
    return inventory[0]
  }
  async tradeItems({ from, per }) {
    let currentSurvivor = await this.show(from);
    let otherSurvivor = await this.show(per);

    if (from.quantity > currentSurvivor.quantity ||
      per.quantity > otherSurvivor.quantity
      ) {
      throw { message: 'Quantity id big', status: 500 }
    }

    if (utilsTrade.isPossible({ currentSurvivor, otherSurvivor })) {
      return true
    } else {
      throw { messsage: 'Not possible themselves items', status: 400 }
    }
  }
}

module.exports = TradeService