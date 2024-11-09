import accessService from '~/services/access.service'

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body)
      return res.status(201).json(await accessService.signUp(req.body))
    } catch (error) {
      next(error)
    }
  }
}

export default new AccessController()
