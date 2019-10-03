'use strict'

class Trade {
  contructor() {
  }
  isPossible ({ currentSurvivor, otherSurvivor }) {
    let currentSruvivorPoints = 
      currentSurvivor.quantity * 
      currentSurvivor.points
    let otherSurvivorPoints = 
      otherSurvivor.quantity * 
      otherSurvivor.points
    if (currentSruvivorPoints === otherSurvivorPoints) {
      return true
    } else {
      return false
    }
  }
}

module.exports = Trade;