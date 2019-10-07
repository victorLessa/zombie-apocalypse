'use strict'

const utilsTrade = require('../utils/trade');

class PropertiesService {
  constructor(db) {
    this.db = db
    this.utilsTrade = new utilsTrade();
  }
  async show() {
    let survivors = await this.db('survivors')
      .select('id', 'name')
      .where('survivors.infected', 0)
    let result = [];
    for (let i = 0; i < survivors.length; i++) {
      let items = await this.db.column([
        'items.name as item_name',
        'inventory.quantity',
        'inventory.item_id',
        'survivors.name'
      ]).from('inventory')
        .leftJoin('items', 'items.id', 'inventory.item_id')
        .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
        .where('inventory.survivor_id', survivors[i].id)
        .andWhere('survivors.infected', 0)
      result[i] = { name: survivors[i].name, items: [] }
      for (let j = 0; j < items.length; j++) {
        result[i].items.push({ name: items[j].item_name, quantity: items[j].quantity })
      }
    }
    return { result }
  }
  async index({ id }) {
    let items = await this.db.column([
      'items.name as item_name',
      'inventory.quantity',
      'inventory.item_id',
      'survivors.name'
    ]).from('inventory')
      .leftJoin('items', 'items.id', 'inventory.item_id')
      .leftJoin('survivors', 'survivors.id', 'inventory.survivor_id')
      .where('inventory.survivor_id', id)
      .andWhere('survivors.infected', 0)
    let result = {}
    if (items.length < 1) {
      throw { message: 'Infected Survivor', status: 400 }
    }
    result['name'] = items[0].name
    result['items'] = []
    for (let i = 0; i < items.length; i++) {
      result['items'][i] = { name: items[i].item_name, quantity: items[i].quantity }
    }
    return { result }
  }
  async getInventory({ survivor_id, item_id }) {
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
  async removeInventory({ quantity, survivor_id, item_id }) {
    let item = await this.db('inventory').select('quantity')
      .where({ survivor_id, item_id })
    item[0].quantity -= quantity
    await this.db('inventory')
      .update(item[0])
      .where({ survivor_id, item_id: item_id })
    return item
  }
  async addInventory({ quantity, survivor_id, item_id }) {
    let item = await this.db('inventory').select('quantity')
      .where({ survivor_id, item_id })
    item[0].quantity += quantity
    await this.db('inventory')
      .update(item[0])
      .where({ survivor_id, item_id: item_id })
    return item
  }
  async tradeItems({ from, per }) {
    let currentSurvivor = await this.getInventory(from);
    let otherSurvivor = await this.getInventory(per);

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
      throw { message: "User doesn't have this many items", status: 500 }
    }
    currentSurvivor.quantity = from.quantity
    otherSurvivor.quantity = per.quantity
    if (this.utilsTrade.isPossible({ currentSurvivor, otherSurvivor })) {
      await this.removeInventory({ 
        quantity: from.quantity, 
        survivor_id: from.survivor_id, 
        item_id: from.item_id
      });
      await this.addInventory({
        quantity: per.quantity,
        survivor_id: from.survivor_id,
        item_id: per.item_id
      });
      await this.removeInventory({
        quantity: per.quantity,
        survivor_id: per.survivor_id,
        item_id: per.item_id
      });
      await this.addInventory({
        quantity: from.quantity,
        survivor_id: per.survivor_id,
        item_id: from.item_id 
      });
      return { message: 'Change sucessfly', status: 200 }
    } else {
      throw { messsage: 'Not enough points to trade', status: 400 }
    }
  }
}

module.exports = PropertiesService