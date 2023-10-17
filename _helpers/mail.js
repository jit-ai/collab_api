const hbs = require('nodemailer-express-handlebars');
const path = require('path');

function transporter(){
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'jit.jitendra008@gmail.com',
            pass: 'lklrrylqbupecino'
        }
    });
    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('_helpers/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('_helpers/views/'),
    };

    // use a template file with nodemailer
    return transporter.use('compile', hbs(handlebarOptions))
}
module.exports = transporter;