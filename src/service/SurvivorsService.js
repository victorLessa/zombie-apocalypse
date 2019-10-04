'use strict'

class Survivors {
  constructor(db) {
    this.db = db;
  }
  async index({ id }) {
    let result = await this.db('survivors')
      .where({ id, infected: 0 })
    if (result.length < 1) {
      throw { message: 'Survivor not found or got infected', status: 404 }
    }
    return { result }
  }
  async show() {
    let result = await this.db('survivors')
      .where('survivors.infected', 0)
      .limit(30)
      .orderBy('survivors.id', 'asc')
    return { result }
  }
  async create ({name, age, sex, last_place, ...items}) {
    let hasSurvivors = await this.db('survivors').where({ name, age, sex })
    let promise;
    let geoLoc = 'point(' + last_place + ')';
    if (hasSurvivors.length < 1) {
      await this.db.transaction(async trx => {
        await this.db('survivors')
          .transacting(trx)
          .insert({ name, age, sex })
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
                    .then(async (resp) => {
                      await this.db.raw('UPDATE survivors SET last_place = ' + geoLoc + ' WHERE id = ' + survivorId[0]).transacting(trx)
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
  async update({ last_place }, { id }) {
    let geoLoc = 'point(' + last_place + ')';
    console.log(geoLoc, id)
    await this.db.raw('UPDATE survivors SET last_place = ' + geoLoc + ' WHERE id = ' + id)
    return
  }
  async updateInfectionIndicator ({ id }) {
    let survivorInfection = await this.db('infection_indicator')
      .select('alerts')
      .where({ survivor_id: id })
    
    if (!survivorInfection.length < 1) {
      survivorInfection[0].alerts ++;
      if (survivorInfection[0].alerts < 3) {
        await this.db('infection_indicator')
          .update({ alerts: survivorInfection[0].alerts })
          .where({ id })
      } else if (survivorInfection[0].alerts > 2){
        await this.db('infection_indicator')
          .update({ alerts: 3 })
          .where({ id })
        await this.db('survivors').update({ infected: true })
          .where({ id: id })
      }
    } else {
      throw { message: 'Survivor not found', status: 404 }
    }
    return { message: 'Successful alert', status: 200 }
  }
}

module.exports = Survivors