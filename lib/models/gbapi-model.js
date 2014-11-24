'use strict';

var _ = require('underscore'),
    GBAPIBase = require('../mixins/gbapi-base'),
    Model = require('./model');

/** 
 * Base Backbone.Model for all GiantBomb.com API resources 
 * @export models/gbapi-model
 */
module.exports = Model.extend(_.extend({}, GBAPIBase, {
    initialize: function (attributes, options) {
        this.filters = this.filters || (options && options.filters) || this.collection.filters || {};
    }
}));