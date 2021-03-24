import nodemailer from 'nodemailer'

const sendMail = async (emailTo: string) => {
  try {

    const transport = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    await transport.sendMail({
      from: '"My APP" <luis16vitor48@gmail.com>',
      to: emailTo,
      subject: 'Hello teste',
      text: 'Hello world',
      html: '<p> It it a test </p>'
    })

    return 

  } catch(error){
    return error
  }
}

export default sendMail