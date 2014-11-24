'use strict';

var _ = require('underscore'),
    Backbone = require('../modules/backbone-jquery');

/**
 * Base Backbone.View class. 
 * @exports views/view
 */
module.exports = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: function () {
        if (this.template) {
            this.$el.html(this.template(_.result(this, 'templateData')));
        }
        return this;
    }
});