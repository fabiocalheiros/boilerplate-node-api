import crypto from 'crypto';

import ExampleMail from '../jobs/ForgotPassMail';
import Queue from '../../lib/Queue';

import User from '../models/User';

class ForgotPasswordController {
  async forgot_password(req, res) {

    const token = crypto.randomBytes(20, (err, buf) => {
      if (err) throw err;
      return buf.toString('hex');
    });

    const user = await User.findOne({ where: { email: req.body.email } });

    user.dataValues.token = token;

    await Queue.add(ExampleMail.key, {
      user,
    });

    return res.json({
      ok: user,
    });
  }
}

export default new ForgotPasswordController();
