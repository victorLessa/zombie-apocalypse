// indes, show, store, destroy, update
const SurvivorsControler = function (SurvivorService) {
  this.SurvivorService = SurvivorService;
  return {
    async index (req, res, next) {
      try {
        res.status(200).send('Hello World')
      } catch (error) {
        res.status(500).send(error)
        next();
      }
    },
    async store (req, res, next) {
      try {
        let result = await this.SurvivorService.create(req.body)
        res.status(200).send(result)
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    },
    async updateInfectionIndicator (req, res, next) {
      try {
        let result = await this.SurvivorService.updateInfectionIndicator(req.body);
        res.status(200).send(result);
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error);
      }
    }
  }
}

module.exports = SurvivorsControler