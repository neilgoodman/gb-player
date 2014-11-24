'use strict';

var GBAPIModel = require('./gbapi-model');

/** 
 * Backbone.Model for the video resource: {@link http://www.giantbomb.com/api/documentation#toc-0-44}
 * @exports models/video-model
 */
module.exports = GBAPIModel.extend({
	urlRoot: 'video'
});