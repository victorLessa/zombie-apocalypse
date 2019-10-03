const TradeController = function (TradeService) {
  this.TradeService = TradeService;
  return {
    async tradeItems(req, res, next) {
      try {
        let body = req.body;
        body.from.survivor_id = parseInt(req.params.id);
        let result = await this.TradeService.tradeItems(body);
        res.status(200).send(result);
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}

module.exports = TradeController;