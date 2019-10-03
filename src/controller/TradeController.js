const TradeController = function (TradeService) {
  this.TradeService = TradeService;
  return {
    async tradeItems(req, res, next) {
      try {
        let result = await this.TradeService.tradeItems(req.body)
        res.status(200).send(result);
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}

module.exports = TradeController;