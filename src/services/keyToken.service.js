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

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static removeKeyByUserId = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId })
  }
}

export default KeyTokenService
