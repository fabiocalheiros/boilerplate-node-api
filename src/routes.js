import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import AuthController from './app/controllers/AuthController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/auth', AuthController.store);

routes.post('/auth/forgot_password', AuthController.forgot_password);
routes.post('/auth/reset_password', AuthController.reset_password);

// so vale o AuthMiddleware para o que estiver abaixo dele
routes.use(AuthMiddleware);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
