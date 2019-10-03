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
    let hasSurvivors = await this.db('survivors').where({ name, age, sex })
    let promise;
    if (hasSurvivors.length < 1) {
      await this.db.transaction(async trx => {
        await this.db('survivors')
          .transacting(trx)
          .insert({ name, age, sex, last_place })
          .then(async survivorId => {
            await this.db('infection_indicator')
              .transacting(trx)
              .insert({ survivor_id: survivorId[0]})
              .then(async (resp) => {
                for (let i = 0; i < items.items.length; i++) {
                  items.items[i].survivor_id = survivorId[0]
                  await this.db('inventory')
                    .transacting(trx)
                    .insert({
                      survivor_id: items.items[i].survivor_id,
                      item_id: items.items[i].item_id,
                      quantity: items.items[i].quantity
                    })
                }
              })
          }).catch(trx.rollback)
        })
      promise = await this.db('survivors').select('id', 'name', 'age').orderBy('id', 'desc').limit(1)
    } else {
      throw { message:'User is already in the database', status: 500 };
    }
    return promise[0]
  }
  async updateInfectionIndicator ({ survivor_id }) {
    let survivorInfection = await this.db('infection_indicator')
      .select('alerts')
      .where({ survivor_id: survivor_id })
    
    if (!survivorInfection.length < 1) {
      survivorInfection[0].alerts ++;
      if (survivorInfection[0].alerts < 3) {
        await this.db('infection_indicator')
          .update({ alerts: survivorInfection[0].alerts })
          .where({ survivor_id })
      } else if (survivorInfection[0].alerts > 2){
        await this.db('infection_indicator')
          .update({ alerts: 3 })
          .where({ survivor_id })
        await this.db('survivors').update({ infected: true })
          .where({ id: survivor_id })
      }
    } else {
      throw { message: 'Survivor not found', status: 404 }
    }
    return { message: 'Successful alert', status: 200 }
  }
}

module.exports = Survivors