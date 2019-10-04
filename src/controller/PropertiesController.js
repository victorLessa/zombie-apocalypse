const TradeController = function (PropertiesService) {
  this.PropertiesService = PropertiesService;
  return {
    async index(req, res, next) {
      try {
        let result = await this.PropertiesService.index(req.params);
        res.send(result)
      } catch (error) {
        res.status(error.error || 500).send(error)
        next(error)
      }
    },
    async show (req, res, next) {
      try {
        let result = await this.PropertiesService.show();
        res.send(result)
      } catch(error) {
        res.send(error)
        next(error)
      }
    },
    async tradeItems(req, res, next) {
      try {
        let body = req.body;
        body.from.survivor_id = parseInt(req.params.id);
        let result = await this.PropertiesService.tradeItems(body);
        res.status(200).send(result);
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}

module.exports = TradeController;