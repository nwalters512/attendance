const { Server } = require('http')
const express = require('express')
const expressSession = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const bodyParser = require('body-parser')

const logger = require('./logger')
const config = require('./lib/config.js')
const dbDriver = require('./dbDriver')
const { setupPassport } = require('./auth/passport-config.js');

const app = express()
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false, limit: 200 * 1024 }))
app.use(bodyParser.json())
app.use(expressSession({
  resave: false,
  saveUninitialized: true,
  secret: config.secret
}));
app.use(flash());

setupPassport(app);

// bind error flash for all pages
app.use( (req, res, next) => {
    res.locals._err = req.flash("error");
    next();
});
// bind the logged in user, for the header
app.use( (req, res, next) => {
    res.locals._user = req.user;
    next();
});

app.use('/', require('./pages/home/home'))
app.use('/login', require('./pages/login/login'))
app.use('/register', require('./pages/register/register'))
app.use('/logout', (req, res, _) => {
    req.logout();
    res.redirect('/');
});
app.use('/student', require('./pages/student/student'))
app.use('/course/:courseId', require('./pages/course/course'))
app.use(
  '/courseInstance/:courseInstanceId',
  require('./pages/courseInstance/courseInstance')
)
app.use('/section/:sectionId', require('./pages/section/section'))
app.use('/meeting/:meetingId', require('./pages/meeting/meeting'))
app.use(
  '/sectionMeeting/:sectionMeetingId',
  require('./pages/sectionMeeting/sectionMeeting')
)

dbDriver.initDB(
  err => {
    if (err) {
      logger.error('DB initialization failed')
      logger.error(err)
      return
    }
    logger.info('Finished DB initialization.')
    const server = Server(app)
    server.listen(config.PORT)
    logger.info(`Listening on ${config.PORT}`)
  },
  err => {
    if (err) {
      logger.error('DB initialization failed due to idle error.')
      logger.error(err)
    }
  }
)
