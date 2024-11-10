import { apiKeyService } from '~/services/apiKey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({ message: 'Forbidden Error' })
    }
    const objKey = await apiKeyService.findById(key)
    if (!objKey) {
      return res.status(403).json({ message: 'Forbidden Error' })
    }
    req.objKey = objKey
    return next()
  } catch (error) {}
}

export const permissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission Denied!' })
    }

    console.log('Permissions::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permissions)
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission Denied!' })
    }

    return next()
  }
}

export const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next)
