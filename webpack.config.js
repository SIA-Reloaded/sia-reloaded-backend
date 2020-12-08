const path = require('path');

console.log(path.join(__dirname, 'build'))

module.exports = {
  target: 'node12',
  mode: "production",
  entry: {
    getCourseGroups: './src/handlers/admins/get-course-groups.js',
    getCourses: './src/handlers/admins/get-courses.js',
    updateRequest: './src/handlers/admins/update-request.js',
    putStudentInCourseGroup: './src/handlers/admins/put-student-in-course-group.js',
    getRequest: './src/handlers/admins/get-request.js'
  },
  output: {
    filename: '[name]/[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'build'),
    sourceMapFilename: '[name]/index.js.map',
  },
};