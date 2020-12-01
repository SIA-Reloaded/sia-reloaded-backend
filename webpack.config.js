const path = require('path');

console.log(path.join(__dirname, 'build'))

module.exports = {
  target: 'node12',
  mode: "production",
  entry: {
    getCourseGroups: './src/handlers/admins/get-course-groups.js',
    getCourses: './src/handlers/admins/get-courses.js',
  },
  output: {
    filename: '[name]/[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'build'),
    sourceMapFilename: '[name]/index.js.map',
  },
};