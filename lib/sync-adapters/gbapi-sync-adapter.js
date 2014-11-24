'use strict';

/** @module sync-adapters/gbapi-sync-adapter */

var _ = require('../modules/underscore-string'),
    Backbone = require('../modules/backbone-jquery');

/**
 * Backbone.sync adapter for the GiantBomb.com API. Only supports
 * the read method.
 *
 * @param {string} method Only supports 'read'.
 * @param {Backbone.Model|Backbone.Collection} model The model or collection using the sync adapter.
 * @param {Object} options Properties will be merged in with the params sent to Backbone.ajax. API resource filters
 *                         can be passed in on options.filters. options.filters.api_key required to authenticate.
 *
 * @returns {jQuery.Promise} The result of Backbone.ajax is returned, which is a Promise if jQuery is being used.
 *
 * @throws {Error} Unsupported method given, only "read" allowed
 * @throws {Error} "options.filters.api_key" not set
 * @throws {Error} A "url" property or function must be specified
 */
module.exports = function (method, model, options) {
    if (!method || method.toLowerCase() != 'read') throw new Error('Unsupported method "' + method + '" given, only "read" allowed');

    // options defaults.
    options = options || {};
    _.defaults(options.filters || (options.filters = {}), {
        format: 'json'
    });

    if (!options.filters.api_key) throw new Error('"options.filters.api_key" not set');

    // Setup params for ajax call. options.filters are sent
    // as query string params.
    var params = {
            type: 'GET',
            dataType: options.filters.format,
            data: options.filters
        };
    
    var url = _.result(model, 'url') || urlError();
    url = _.trim(_.result(model, 'url'), '/');
    url = ['https://www.giantbomb.com/api', url].join('/') + '/'; // Collection resources in the GiantBomb API need to end in a slash.
    params.url = url;

    // Call ajax and merge in options with params to allow overrides.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, _.omit(options, 'filters')))
    model.trigger('request', model, xhr, options);
    return xhr;
};

function urlError() {
    throw new Error('A "url" property or function must be specified');
}