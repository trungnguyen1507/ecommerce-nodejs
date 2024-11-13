import { CREATED, SuccessResponse } from '~/core/success.response'
import accessService from '~/services/access.service'

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await accessService.login(req.body)
    }).send(res)
  }
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body)
    new CREATED({
      message: 'Registered OK!',
      metadata: await accessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

export default new AccessController()
