'use strict';

var _ = require('underscore'),
    GBAPIBase = require('../mixins/gbapi-base'),
    Collection = require('./collection');

/** 
 * Base Backbone.Collection for all GiantBomb.com API resources. 
 * @exports collections/gbapi-collection
 */
module.exports = Collection.extend(_.extend({}, GBAPIBase, {
    initialize: function (models, options) {
        this.filters = this.filters || (options && options.filters) || {};
    }
}));