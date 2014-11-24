'use strict';

var GBAPICollection = require('./gbapi-collection'),
    VideoModel = require('../models/video-model');

/** 
 * Backbone.Collection for the videos resource: {@link http://www.giantbomb.com/api/documentation#toc-0-45} 
 * @exports collections/videos-collection
 */
module.exports = GBAPICollection.extend({
    model: VideoModel,
    url: 'videos'
});