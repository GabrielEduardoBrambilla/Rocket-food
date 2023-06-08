const { Router } = require('express')
const dishesRoutes = Router()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const multer = require('multer')
const uploadConfig = require('../configs/upload')
const upload = multer(uploadConfig.MULTER)

const DishesController = require('../controllers/DishesController')
const dishesController = new DishesController()

dishesRoutes.post(
  '/',
  ensureAuthenticated,
  upload.single('image'),
  dishesController.create
)
dishesRoutes.get('/show', dishesController.show)
dishesRoutes.delete('/delete', dishesController.delete)
dishesRoutes.get('/index', dishesController.index)

module.exports = dishesRoutes
