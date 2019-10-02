'use strict'

class Survivors {
  constructor(db) {
    this.db = db;
  }
  async index() {
    let result = await this.db('survivors')
    return result
  }
  async create ({name, age, sex, last_place, ...items}) {
    let result = await this.db.transaction(async trx => {
      await this.db('survivors')
        .transacting(trx)
        .insert({ name, age, sex, last_place })
        .then(async resp => {
          for (let i = 0; i < items.items.length; i++) {
            items.items[i].survivor_id = resp[0]
            await this.db('inventory')
              .transacting(trx)
              .insert({
                survivor_id: items.items[i].survivor_id,
                item_id: items.items[i].item_id,
                quantity: items.items[i].quantity
              })
          }
        }).catch(trx.rollback)
    })
    return result
  }
}

module.exports = Survivors