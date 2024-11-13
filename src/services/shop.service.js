import shopModel from '~/models/shop.model'

const findByEmail = async ({ email, select = { email: 1, password: 1, name: 1, status: 1, roles: 1 } }) => {
  return await shopModel.findOne({ email }).select(select).lean()
}

export const shopService = { findByEmail }
