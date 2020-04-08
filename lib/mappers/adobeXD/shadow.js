const camelcase = require('camelcase');

const { tokenize, formatColor, normalizeColorValues } = require('../../utils');

function getShadowEffectProperties(params) {
  const container = Object.values(params)[0][0];
  
  return {
    // For some reason in XD, if you enter blur = 4, it divides it by 2
    blur: container.r * 2,
    x: container.dx,
    y: container.dy,
    spread: null,
    color: formatColor({ ...normalizeColorValues(container.color.value), alpha: container.color.alpha }),
  };
};

function mapShadow(artboard) {
  const shadowParams = artboard.value.style.filters[0];

  return {
    id: camelcase(artboard.name.split('/').pop()),
    token: tokenize('shadow'),
    type: tokenize(shadowParams.type),
    ...getShadowEffectProperties(shadowParams.params),
  };
};

module.exports = mapShadow;
