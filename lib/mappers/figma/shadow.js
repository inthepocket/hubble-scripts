const {mapColorKeys, tokenize} = require('../../utils');
const formatColor = require('../sketch/color');

const getShadowEffectProperties = (shadow) => {
    const {effects} = shadow.children[0];
    return {
        blur: effects[0].offset.radius,
        x: effects[0].offset.x,
        y: effects[0].offset.y,
        type: effects[0].type.toLowerCase().replace('_', '-')
    }
};
exports.getShadowEffectProperties = getShadowEffectProperties; 

const getShadowColor =  (shadow) => {
    const {color} = shadow.children[0].effects[0];
    return {color: formatColor(mapColorKeys(color))};
}
exports.getShadowColor = getShadowColor;

module.exports = (shadow) => ({
    id: shadow.name.split('/').pop(),
    token: tokenize('shadow'),
    ...getShadowEffectProperties(shadow),
    ...getShadowColor(shadow),
    spread: null, // spread not implemented in figma
});
 