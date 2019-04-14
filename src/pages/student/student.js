const router = require('express').Router({ mergeParams: true })
const fileUpload = require('express-fileupload')
const { sqlLoader } = require('@prairielearn/prairielib')
const csvParse = require('csv-parse/lib/sync')
//const parse = require('csv-parse')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

// Used to sanitize UTF-8 strings
const utf8Re = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g

router.use(
  fileUpload({
    safeFileNames: true,
  })
)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }
    const result = await dbDriver.asyncQuery(sql.select_students, {})
    res.locals.students = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.sendStatus(403)
      return
    }
    if (req.body.__action === 'updateStudent') {
      const params = {
        fName: req.body.firstName,
        lName: req.body.lastName,
        netid: req.body.netid,
        major: req.body.major,
        id: req.body.id,
      }
      await dbDriver.asyncQuery(sql.update_student, params)
      res.redirect(req.originalUrl)
    } else if (req.body.__action === 'uploadRoster') {
      if (Object.keys(req.files).length == 0) {
        // TODO flash err
        console.error('No files uploaded!')
        return
      }
      const rosterFile = req.files.rosterFile
      if (rosterFile === null || rosterFile === undefined) {
        // TODO flash err
      }
      if (rosterFile.data === null || rosterFile === undefined) {
        // TODO flash err
      }
      const rosterCSVString = new TextDecoder()
        .decode(rosterFile.data)
        .replace(utf8Re, '')
      const rosterData = csvParse(rosterCSVString, {
        columns: true,
        skip_empty_lines: true,
        encoding: 'UTF-8',
      })
      console.log(rosterData)
      /* Following code setup the same way as sync fails (we use sync in zephyr)
        parse(rosterCSVString, {
            columns: true,
            skip_empty_lines: true,
            encoding: 'UTF-8'
        }, (err, rosterData) => {
            if (err) {
                // TODO flash err
                return
            }
            let rosterObject = {}
            for (const entry of rosterData) {
                for (const key of Object.keys(entry)) {
                    if (!rosterObject.hasOwnProperty(key)) {
                        rosterObject[key] = [entry[key]]
                    } else {
                        rosterObject[key].append(entry[key])
                    }
                }
            }
            // TODO sql query
            console.log(rosterObject)
            res.redirect(req.originalUrl)
        })
        * Stack trace is completely internal so assuming for some reason the async version of this CSV parser is broken
        * TypeError [ERR_INVALID_ARG_TYPE]: The "buf" argument must be one of type Buffer, TypedArray, or DataView. Received type object
        * at StringDecoder.write (string_decoder.js:74:11)
        * at readableAddChunk (_stream_readable.js:263:33)
        * at Parser.Readable.push (_stream_readable.js:224:10)
        * at Parser.Transform.push (_stream_transform.js:151:32)
        * at Parser.__onRow (/home/binary-eater/Documents/cs411-attendance/node_modules/csv-parse/lib/index.js:629:18)
        * at Parser.__parse (/home/binary-eater/Documents/cs411-attendance/node_modules/csv-parse/lib/index.js:496:40)
        * at Parser._transform (/home/binary-eater/Documents/cs411-attendance/node_modules/csv-parse/lib/index.js:340:22)
        * at Parser.Transform._read (_stream_transform.js:190:10)
        * at Parser.Transform._write (_stream_transform.js:178:12)
        * at doWrite (_stream_writable.js:415:12) 
        */
    }
  })
)

module.exports = router
