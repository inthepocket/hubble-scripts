const { mapColorKeys, formatColor } = require('../../utils');

const getColorProperty = component => component.children[0].fills[0].color;

module.exports = component => ({
  ...formatColor(mapColorKeys(getColorProperty(component))),
});
