const fs = require('fs').promises;

module.exports = async(file) =>  fs.readFile(file);
