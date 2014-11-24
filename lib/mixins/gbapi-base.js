'use strict';    

/** @module common/gbapi-base-factory */

var _ = require('underscore'),
    GBAPISyncAdapter = require('../sync-adapters/gbapi-sync-adapter');

/**
 * Common methods for Backbone.Model or Backbone.Collection that interface
 * with the GiantBomb.com API.
 *
 * @mixin
 */
module.exports = {
    /**
     * Override default Backbone.sync adapter with GBAPISyncAdapter.
     */
    sync: function () {
        this.response_error = false;
        return GBAPISyncAdapter.apply(this, arguments);
    },
    /**
     * Override save with a noop.
     * @function
     */
    save: _.noop,
    /**
     * Override destroy with a noop.
     * @function
     */
    destroy: _.noop,
    /**
     * Override fetch.
     *
     * If options.filters it not given, then this.filters (can be either a property or function)
     * will be set to options.filters. options.filters.api_key is always set/overridden by this.apiKey
     * (which can also be either a property or a function).
     */
    fetch: function (options) {
        options = options || {};
        options.filters = options.filters || _.result(this, 'filters') || {};
        options.filters.api_key = _.result(this, 'apiKey');
        return this.constructor.__super__.constructor.__super__.fetch.apply(this, [options]);
    },
    /**
     * Override parse to unwrap GiantBomb.com API resources from their container
     * format. See this link for more details: {@link http://www.giantbomb.com/api/documentation}
     */
    parse: function (response, options) {
        if (_.has(response, 'status_code') && response.status_code == 1 && response.results) {
            return response.results;
        }
        else if (_.has(response, 'status_code') && response.status_code > 1) {
            this.response_error = true;
            this.trigger('error', this, response, options);
            return;
        }
        return response;
    },
    /**
     * Returns the api_key for the GiantBomb.com API.
     */
    apiKey: function () {
        return window.localStorage.getItem('gb_api_key');
    }
};