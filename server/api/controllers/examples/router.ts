import * as express from 'express';
import controller from './controller'
export default express.Router()
    .get('/', controller.readAll)
    .post('/', controller.create)
    .get('/:id', controller.readById)
    .delete('/:id', controller.deleteById)
    .patch('/:id', controller.updateById);
