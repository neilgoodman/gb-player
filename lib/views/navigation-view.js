'use strict';

var View = require('./view');

module.exports = View.extend({
    tagName: 'nav',
    attributes: {
        'class': 'navigation-view',
        'role': 'navigation',
        'data-hook': 'navigation-view'
    },
    template: require('../templates/navigation-view/index.hbs')
});