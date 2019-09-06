import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

import ExampleMail from '../jobs/ExampleMail';
import Queue from '../../lib/Queue';

class UserController {
  async index(req, res) {
    const user_list = await User.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(user_list);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // check user exists
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email } = await User.create(req.body);

    const date_user = {
      name: req.body.name,
      email: req.body.email,
      date: new Date(),
    };

    await Queue.add(ExampleMail.key, {
      date_user,
    });

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    // validation data
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { email, oldPassword } = req.body;

    // procura o usuario pelo id.
    const user = await User.findByPk(req.userId);

    // verifica se o password esta correto
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // se estiver tudo certo, atualiza o usuario
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const userExists = await User.findOne({ where: { id } });

    if (!userExists) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    await User.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({ sucess: 'User excluded with sucess.' });
  }
}

export default new UserController();
