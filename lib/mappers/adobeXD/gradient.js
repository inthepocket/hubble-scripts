const camelcase = require('camelcase');

const { tokenize } = require('../../utils');

function mapGradient(artboard) {

  return {
    token: tokenize('gradient'),
    name: camelcase(artboard.name),
  }
};

module.exports = mapGradient;
