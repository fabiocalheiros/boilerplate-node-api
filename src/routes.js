import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// so vale o AuthMiddleware para o que estiver abaixo dele
routes.use(AuthMiddleware);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
