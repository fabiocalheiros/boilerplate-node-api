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
        token: user.token,
      },
    });
  }
}

export default new ForgotPassMail();
