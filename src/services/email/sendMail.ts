import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const sendMail = async (emailTo: string, link: any) => {
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

    const source = fs.readFileSync(path.join(__dirname, './template/resetPassword.hbs'), 'utf-8')
    const template = handlebars.compile(source)

    console.log(link)
    await transport.sendMail({
      from: '"My APP" <luis16vitor48@gmail.com>',
      to: emailTo,
      subject: 'Hello teste',
      text: 'Hello world',
      html: template({link: link}),
    })

    return 

  } catch(error){
    return error
  }
}

export default sendMail