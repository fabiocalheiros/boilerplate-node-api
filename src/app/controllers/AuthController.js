import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import crypto from 'crypto';

import User from '../models/User';
import authConfig from '../../config/auth';

import ForgotPassMail from '../jobs/ForgotPassMail';
import Queue from '../../lib/Queue';

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}

class AuthController {
  async store(req, res) {
    // cria a estrutura base que deve ser informada.
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required(),
    });

    // verifica se o schema é valido, (testa se esta faltando algum dado)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { email, password } = req.body;

    // procura pelo usuario
    const user = await User.findOne({
      where: { email },
    });

    // se o usuario não foi encontrado
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // verifica se o password está correto
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name } = user;

    // retorna os dados do usuario com o token de autorização
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: generateToken({ id }),
    });
  }

  async forgot_password(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    const {
      id,
      name,
      email,
      password_reset_token,
      password_reset_expires,
    } = await user.update(
      { password_reset_token: token, password_reset_expires: now },
      { where: { id: user.id } }
    );

    await Queue.add(ForgotPassMail.key, {
      user,
    });

    return res.send({
      id,
      name,
      email,
      password_reset_token,
      password_reset_expires,
    });
  }

  async reset_password(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) return res.status(400).send({ error: 'User not found' });

      if (token !== user.password_reset_token)
        return res.status(400).send({ error: 'Token invalid' });

      const now = new Date();

      if (now > user.password_reset_expires)
        return res
          .status(400)
          .send({ error: 'Token expired, generate a new one' });

      user.password = password;
      user.password_reset_token = null;
      user.password_reset_expires = null;

      await user.save();

      res.send();
    } catch (err) {
      res.status(400).send({ error: 'Cannot reset password, try again' });
    }
  }
}

export default new AuthController();
