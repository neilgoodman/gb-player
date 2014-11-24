'use strict';

var _ = require('underscore'),
    View = require('./view'),
    ViewTree = require('../mixins/view-tree');

module.exports = View.extend({
    tagName: 'div',
    attributes: {
        'class': 'videos-view',
        'data-hook': 'videos-view'
    },
    template: require('../templates/videos-view/index.hbs'),
    templateData: function () {
        return this.models;
    },
    render: function () {
        this.removeAllViews();
        this.$el.empty();
        if (this.collection.isEmpty()) return this;
        this.$el.html(this.template(_.result(this, 'templateData')));
        this._addVideoViews();
    },
    _addVideoViews: function () {
        this.collection.each(function (model) {
            this.addView('videos', new VideoModel({ model: model }), '[data-hook="video-views"]');
        });
    }
});