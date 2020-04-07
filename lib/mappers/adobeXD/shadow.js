const camelcase = require('camelcase');

const { tokenize } = require('../../utils');

// function getShadowEffectProperties() {

//   return {

//   };
// };

function mapShadow(artboard) {

  // const filter = artboard.value;

  return {
    id: camelcase(artboard.name.split('/').shift()),
    token: tokenize('shadow'),
    // ...getShadowEffectProperties(filter),
  };
};

module.exports = mapShadow;
