// indes, show, store, destroy, update
module.exports = function (SurvivorService) {
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
        let result = await SurvivorService.create(req.body)
        res.status(200).send(result)
      } catch (error) {
        res.status(error.status || 500).send(error)
        next(error)
      }
    }
  }
}