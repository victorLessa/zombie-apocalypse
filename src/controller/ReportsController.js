const ReportsController = function (ReportsController) {
  this.ReportsController = ReportsController;
  return {
    async infectedPercentage(req, res, next) {
      try {
        let result = await this.ReportsController.infectedPercentage()
        res.send(result)
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}

module.exports = ReportsController;