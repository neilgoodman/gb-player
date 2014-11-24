'use strict';

var View = require('./view');

module.exports = View.extend({
    tagName: 'div',
    attributes: {
        'class': 'page-view',
        'data-hook': 'page-view'
    }
});