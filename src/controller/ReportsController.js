const ReportsController = function (ReportsController) {
  this.ReportsController = ReportsController;
  return {
    async percentages(req, res, next) {
      try {
        let result = await this.ReportsController.percentages()
        res.send(result)
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}

module.exports = ReportsController;