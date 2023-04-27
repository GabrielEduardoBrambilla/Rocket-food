const knex = require('../database/knex')

class Shopping_cartController {
  async create(request, response) {
    const { id_User, id_Dish, quantity } = request.body

    const checkDishExists = await knex('shopping_cart')
      .select('id')
      .where({ id_User, id_Dish })
      .first()

    if (checkDishExists) {
      const itemCart = await knex('shopping_cart')
        .select()
        .where({ id_User, id_Dish })
        .first()
      await knex('shopping_cart')
        .update({ quantity: quantity })
        .where({ id: itemCart.id })
      const updatedItemCart = await knex('shopping_cart')
        .select()
        .where({ id: itemCart.id })
        .first()
      return response.json({
        Message: `Dish quantity updated to cart | Quant= ${updatedItemCart.quantity}`
      })
    }

    const [id_shopping_cart] = await knex('shopping_cart').insert({
      id_User,
      id_Dish,
      quantity
    })

    return response.json({
      Message: `Dish add to cart | Quant2= ${quantity}`,
      Component: id_shopping_cart
    })
  }
  async show(request, response) {
    const { id_User, id_Dish } = request.body
    const checkDishIsFavorite = await knex('favorite_list')
      .select()
      .where({ id_User, id_Dish })
      .first()
    if (checkDishIsFavorite) {
      const dish = await knex('dishes').where({ id: id_Dish }).first()
      const ingredients = await knex('ingredients')
        .where({ id_Dishes: id_Dish })
        .orderBy('name')

      return response.json({
        ...dish,
        ingredients
      })
    } else {
      return response.status(400).json('Dish is not favorite')
    }
  }
  async delete(request, response) {
    const { id_User, id_Dish } = request.body

    await knex('favorite_list').where({ id_Dish, id_User }).delete()

    return response.json('removed from favorites')
  }
  async index(request, response) {
    const { id_User } = request.body

    const favoriteList = await knex('favorite_list')
      .select('id_Dish')
      .where({ id_User })
      .first()

    if (favoriteList) {
      const dishIds = await knex('favorite_list')
        .select('id_Dish')
        .where({ id_User })

      const dishes = await knex('dishes').whereIn(
        'id',
        dishIds.map(dish => dish.id_Dish)
      )

      const ingredients = await knex('ingredients')
        .whereIn(
          'id_Dishes',
          dishIds.map(dish => dish.id_Dish)
        )
        .orderBy(['id_Dishes', 'name'])

      const meals = dishes.map(dish => ({
        ...dish,
        ingredients: ingredients.filter(
          ingredient => ingredient.id_Dishes === dish.id
        )
      }))

      return response.json(meals)
    } else {
      return response.status(400).json('User does not have a favorite list')
    }
  }
}

module.exports = Shopping_cartController