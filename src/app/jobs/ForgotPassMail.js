import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ForgotPassMail {
  get key() {
    return 'ForgotPassMail';
  }

  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Forgot Password',
      template: 'forgotpassword',
      context: {
        name: user.name,
        email: user.email,
        token: user.password_reset_token,
        date: format(
          parseISO(user.password_reset_expires),
          "'dia' dd 'de' MMMM', às' HH:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new ForgotPassMail();
