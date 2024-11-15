import jwt from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '~/core/error.response'
import { asyncHandler } from '~/helpers/asyncHandler'
import keyTokenService from '~/services/keyToken.service'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

export const createTokenPairs = (payload, accessTokenKey, refreshTokenKey) => {
  try {
    // accessToken
    const accessToken = jwt.sign(payload, accessTokenKey, {
      expiresIn: '2 days'
    })
    const refreshToken = jwt.sign(payload, refreshTokenKey, {
      expiresIn: '7 days'
    })

    // jwt.verify(accessToken, accessTokenKey, (err, decoded) => {
    //   if (err) {
    //     console.log('error verify::', err)
    //   } else {
    //     console.log('decoded verify::', decoded)
    //   }
    // })

    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

export const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - Check userId missing?
   * 2 - get accessToken
   * 3 - verifyToken
   * 4 - check user in dbs?
   * 5 - check keyStore with this userId?
   * 6 - OK all => return next()
   */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')
  // 2
  const keyStore = await keyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.accessTokenKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

export const verifyJWT = async (token, keySecret) => {
  return jwt.verify(token, keySecret)
}
