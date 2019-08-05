const camelcase = require('camelcase');

const { mapColorKeys, formatColor } = require('../../utils');

module.exports = (artboard) => {
  const { color } = artboard.children[0].fills[0];
  const [,,id,variant] = artboard.name.split('/');
  return {
    id: camelcase(`${id}-${variant}`),
    variant,
    ...formatColor(mapColorKeys(color)),
  }
};
