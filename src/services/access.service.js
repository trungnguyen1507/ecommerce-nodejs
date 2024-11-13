import shopModel from '~/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import keyTokenService from './keyToken.service'
import createTokenPairs from '~/auth/authUtils'
import { getInfoData } from '~/utils'
import { AuthFailureError, BadRequestError, ConflictRequestError } from '~/core/error.response'
import { shopService } from './shop.service'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  /**
   * 1 - check email in dbs
   * 2 - match password
   * 3 - create accessTokenKey, refreshTokenKey and save
   * 4 - generate tokens
   * 5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundShop = await shopService.findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Error: Shop not registered!')
    }
    // 2.
    const match = await bcrypt.compare(password, foundShop.password)
    console.log(match)
    if (!match) {
      throw new AuthFailureError('Error: Authentication error!')
    }
    // 3.
    const accessTokenKey = crypto.randomBytes(64).toString('hex')
    const refreshTokenKey = crypto.randomBytes(64).toString('hex')
    // 4.
    const { _id: userId } = foundShop
    const tokens = await createTokenPairs({ userId, email }, accessTokenKey, refreshTokenKey)

    await keyTokenService.createKeyToken({
      userId,
      accessTokenKey,
      refreshTokenKey,
      refreshToken: tokens.refreshToken
    })
    // 5.
    return {
      metadata: {
        shop: getInfoData(['_id', 'name', 'email'], foundShop),
        tokens
      }
    }
  }
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new ConflictRequestError('Error: Email already exist!')
    }

    // step 2: create new shop
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP]
    })
    if (newShop) {
      // create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   }
      // })

      const accessTokenKey = crypto.randomBytes(64).toString('hex')
      const refreshTokenKey = crypto.randomBytes(64).toString('hex')

      const keyStore = await keyTokenService.createKeyToken({ userId: newShop._id, accessTokenKey, refreshTokenKey })

      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'keyStore error'
        }
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString)

      // create token pair
      const tokens = await createTokenPairs({ userId: newShop._id, email }, accessTokenKey, refreshTokenKey)

      return {
        code: 201,
        metadata: {
          shop: getInfoData(['_id', 'name', 'email'], newShop),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
  }
}

export default AccessService
