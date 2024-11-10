import shopModel from '~/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import keyTokenService from './keyToken.service'
import createTokenPairs from '~/auth/authUtils'
import { getInfoData } from '~/utils'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exist
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already registered!'
        }
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
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

export default AccessService
