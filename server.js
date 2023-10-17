require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
nodeMailer = require('nodemailer');
const transporter = require('_helpers/mail')(nodeMailer);
const user = require('./users/users.controller');
const category = require('./categories/category.controller');
const festival = require('./festivals/festival.controller');
const sponsors = require('./sponsors/sponsors.controller');
const adminbanner = require('./adminbanner/adminbanner.controller')
const likes = require('./likes/like.controller');
const collab = require('./collabs/collab.controller');
const comments = require('./comments/comments.controller');
const competition = require('./competition/competition.controller');
const follow = require('./followers/follower.controller');
const voting = require('./votings/voting.controller');
const favourite = require('./favourites/favourite.controller');
const collab_favourite = require('./collab_favourites/collab_favourite.controller');
const notification = require('./notifications/notification.controller');
const feedback = require('./feedback/feedbacks.controller');
const path = require('path');
var session = require('express-session');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOptions = {
    origin: ['http://localhost:8080','https://collab.dezinshop.in'],
    credentials: true
};
app.use(cors(corsOptions));
app.set('view engine', 'ejs');
app.use('/uploads',express.static('uploads'));



// api routes
app.use('/users', user);
app.use('/categories', category);
app.use('/festival', festival);
app.use('/sponsors', sponsors);
app.use('/collab', collab);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/competition', competition);
app.use('/follow', follow);
app.use('/voting', voting);
app.use('/favourite', favourite);
app.use('/adminbanner', adminbanner );
app.use('/collab_favourite', collab_favourite)
app.use('/notification', notification)
app.use('/feedback', feedback)


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
app.listen(port, () => console.log('Server listening on port ' + port));