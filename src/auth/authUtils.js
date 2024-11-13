import jwt from 'jsonwebtoken'

const createTokenPairs = async (payload, accessTokenKey, refreshTokenKey) => {
  try {
    // accessToken
    const accessToken = jwt.sign(payload, accessTokenKey, {
      expiresIn: '2 days'
    })
    const refreshToken = jwt.sign(payload, refreshTokenKey, {
      expiresIn: '7 days'
    })

    jwt.verify(accessToken, accessTokenKey, (err, decoded) => {
      if (err) {
        console.log('error verify::', err)
      } else {
        console.log('decoded verify::', decoded)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

export default createTokenPairs
