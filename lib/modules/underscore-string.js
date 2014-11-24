'use strict';

var _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

/** 
 * Underscore module with Underscore.string mixed in. Underscore.string is also
 * available at _.str
 * @exports modules/underscore-string
 */
module.exports = _;