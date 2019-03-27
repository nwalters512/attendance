const Foswig = require('foswig')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const courseDictionary = require('./course-dictionary')

const courseWords = courseDictionary.words

// TODO May need to increase departments for fun ;)
const departments = ['MemeTech', 'JS', 'Github']

const generateCourses = () => {
  var markov = new Foswig(3)

  const courseCsvWriter = createCsvWriter({
    path: 'csv/course.csv',
    header: [
      {
        id: 'name',
        title: 'Name',
      },
      {
        id: 'dept',
        title: 'Department',
      },
      {
        id: 'num',
      },
    ],
  })

  markov.addWordsToChain(courseWords)

  var randomCourse = markov.generateWord(5, 120, false)

  console.log(randomCourse)

  return randomCourse
}

generateCourses()
