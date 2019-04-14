const ERR = require('async-stacktrace')
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
  asyncErrorHandler(async (req, res, next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }
    res.locals.courseInstanceId = req.params.courseInstanceId

    const resultSec = await dbDriver.asyncQuery(
      sql.select_sections_join_course_instances,
      { instId: req.params.courseInstanceId }
    )

    if (resultSec.rows.length === 0) {
      ERR(
        new Error(
          'Zero rows from query: select_sections_join_course_instances'
        ),
        next
      )
      return
    }

    const instRow = resultSec.rows[0]
    res.locals.instTerm = instRow.ci_term
    res.locals.instName = instRow.ci_name
    res.locals.instYear = instRow.ci_year
    res.locals.sections = resultSec.rows

    const resultMeet = await dbDriver.asyncQuery(
      sql.select_meetings_join_course_instances,
      { instId: req.params.courseInstanceId }
    )

    res.locals.meetings = resultMeet.rows
    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!checks.isLoggedIn(req)) {
      res.sendStatus(403)
      return
    }
    if (req.body.__action === 'newSection') {
      const params = {
        name: req.body.name,
        CRN: Number.parseInt(req.body.CRN, 10),
        ciTerm: req.body.courseInstanceTerm,
        ciName: req.body.courseInstanceName,
        ciYear: Number.parseInt(req.body.courseInstanceYear, 10),
      }
      if (Number.isNaN(params.CRN)) {
        ERR(new Error(`Invalid CRN: ${req.body.CRN}`), next)
        return
      }
      if (Number.isNaN(params.ciYear)) {
        ERR(new Error(`Invalid year: ${req.body.courseInstanceYear}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_sections, params)
      await dbDriver.asyncQuery(sql.insert_sections_sm, params)
    } else if (req.body.__action === 'newMeeting') {
      const params = {
        name: req.body.name,
        ciTerm: req.body.courseInstanceTerm,
        ciName: req.body.courseInstanceName,
        ciYear: Number.parseInt(req.body.courseInstanceYear, 10),
      }
      if (Number.isNaN(params.ciYear)) {
        ERR(new Error(`Invalid year: ${req.body.courseInstanceYear}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_meetings, params)
      await dbDriver.asyncQuery(sql.insert_meetings_sm, params)
    } else if (req.body.__action === 'uploadRoster') {
      if (Object.keys(req.files).length === 0) {
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
      let params = {}
      for (const entry of rosterData) {
        for (const key of Object.keys(entry)) {
          if (!params.hasOwnProperty(key)) {
            params[key] = [entry[key]]
          } else {
            params[key].push(entry[key])
          }
        }
      }
      if (Object.keys(params).length === 0) {
        // TODO flash err
      }
      await dbDriver.asyncQuery(sql.insert_update_roster, params)
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
                        rosterObject[key].push(entry[key])
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
    res.redirect(req.originalUrl)
  })
)

module.exports = router
