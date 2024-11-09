import keytokenModel from '~/models/keytoken.model'

class KeyTokenService {
  static createKeyToken = async ({ userId, accessTokenKey, refreshTokenKey }) => {
    try {
      const tokens = await keytokenModel.create({
        user: userId,
        accessTokenKey,
        refreshTokenKey
      })

      return tokens ? tokens : null
    } catch (error) {
      return error
    }
  }
}

export default KeyTokenService
