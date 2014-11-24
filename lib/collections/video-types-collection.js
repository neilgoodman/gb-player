'use strict';

var GBAPICollection = require('./gbapi-collection'),
    VideoTypeModel = require('../models/video-type-model');

/** 
 * Backbone.Collection for the video_types resource: {@link http://www.giantbomb.com/api/documentation#toc-0-47}
 * @exports collections/video-types-collection
 */
module.exports = GBAPICollection.extend({
    model: VideoTypeModel,
    url: 'video_types'
});