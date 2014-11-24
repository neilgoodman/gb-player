'use strict';

var View = require('./view');

module.exports = View.extend({
    tagName: 'div',
    attributes: {
        'class': 'video-view',
        'data-hook': 'video-view'
    },
    template: require('../templates/video-view/index.hbs'),
    templateData: function () {
        return this.model.attributes
    }
});