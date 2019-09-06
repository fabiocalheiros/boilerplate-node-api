import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ExampleMail {
  get key() {
    return 'ExampleMail';
  }

  async handle({ data }) {
    const { date_user } = data;

    await Mail.sendMail({
      to: `${date_user.name} <${date_user.email}>`,
      subject: 'Subject form email',
      template: 'example',
      context: {
        name: date_user.name,
        email: date_user.email,
        date: format(
          parseISO(date_user.date),
          "'dia' dd 'de' MMMM', às' HH:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new ExampleMail();
