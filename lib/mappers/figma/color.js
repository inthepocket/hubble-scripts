const { mapColorKeys, formatColor } = require('../../utils');

module.exports = component => ({
  ...formatColor(mapColorKeys(component.children[0].fills[0].color))
});
