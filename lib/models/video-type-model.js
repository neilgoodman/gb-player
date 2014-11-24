'use strict';

var GBAPIModel = require('./gbapi-model');

/** 
 * Backbone.Model for the video_type resource: {@link http://www.giantbomb.com/api/documentation#toc-0-46} 
 * @exports models/video-type-model
 */
module.exports = GBAPIModel.extend({
	urlRoot: 'video_type'
});