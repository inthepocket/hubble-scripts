const {mapColorKeys} = require('../../utils');
const formatColor = require('../sketch/color'); // use sketch color formatter

const getColorProperty = (component) => component.children[0].fills[0].color;
exports.getColorProperty = getColorProperty;

module.exports = (component) => ({
    ...(formatColor(mapColorKeys(getColorProperty(component))))
});
