import keytokenModel from '~/models/keytoken.model'

class KeyTokenService {
  static createKeyToken = async ({ userId, accessTokenKey, refreshTokenKey, refreshToken }) => {
    try {
      // lv0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   accessTokenKey,
      //   refreshTokenKey
      // })

      // return tokens ? tokens : null
      const filter = { user: userId },
        update = { accessTokenKey, refreshTokenKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens : null
    } catch (error) {
      throw error
    }
  }
}

export default KeyTokenService
