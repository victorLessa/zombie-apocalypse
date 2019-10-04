// indes, show, store, destroy, update
const SurvivorsControler = function (SurvivorService) {
  this.SurvivorService = SurvivorService;
  return {
    async index (req, res, next) {
      try {
        let result = await this.SurvivorService.index(req.params)
        res.status(200).send(result)
      } catch (error) {
        res.status(500).send(error)
        next();
      }
    },
    async show(req, res, next) {
      try {
        let result = await this.SurvivorService.show()
        res.send(result)
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
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
    async update (req, res, next) {
      try {
        let result = await this.SurvivorService.update(req.body, req.params)
        res.send(result)
      } catch (error) {
        res.status(error.status).send(error)
        next(error)
      }
    },
    async updateInfectionIndicator (req, res, next) {
      try {
        let result = await this.SurvivorService.updateInfectionIndicator(req.params);
        res.status(200).send(result);
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error);
      }
    }
  }
}

module.exports = SurvivorsControler