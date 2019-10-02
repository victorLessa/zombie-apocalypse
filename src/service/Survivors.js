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
          promise = await this.db('survivors').select('name', 'age').first()
      })
    } else {
      throw { message:'User is already in the database', status: 500 };
    }
    return promise
  }
  async updateInfectionIndicator ({ survivor_id }) {
    let survivorInfection = this.db('infection_indicator')
      .select('indications')
      .where({ survivors_id: survivor_id })
    survivorInfection[0].indications ++
    if (survivorInfection[0].indications < 3) {
      await this.db('infection_indicator')
        .update(survivorInfection[0].indications)
        .where({ survivor_id })
    } else if (survivorInfection[0].indications > 2){
      await this.db('survivors').update({ infected: true })
        .where({ id: survivor_id })
    }
    return { message: 'Successful alert', status: 200 }
  }
}

module.exports = Survivors