'use strict';

var _ = require('underscore'),
    View = require('./view'),
    ViewTree = require('../mixins/view-tree'),
    VideoTypesCollection = require('../collections/video-types-collection'),
    VideosCollection = require('../collections/videos-collection');

module.exports = View.extend(_.extend({}, ViewTree, {
    initialize: function () {
        var collection = window.app.getCollection('video-types');
        if (!collection) {
            this.collection = new VideoTypesCollection();
            window.app.addCollection('video-types', this.collection);
        }
        else {
            this.collection = collection;
        }
        this.render();
        this.listenTo(this.collection, 'change', this.render, this);
        this.collection.fetch();
    },
    tagName: 'div',
    attributes: {
        'class': 'video-types-view',
        'data-hook': 'video-types-view'
    },
    template: require('../templates/video-types-view/index.hbs'),
    render: function () {
        this.removeAllViews();
        this.$el.empty();
        if (this.collection.isEmpty()) return this;
        this._addVideosCollections();
        this._addVideosViews();
        return this;
    },
    _addVideosCollections: function () {
        window.app.removeCollection('videos');
        this.collection.each(function (video_type) {
            var videosCollection = new VideosCollection({ 
                    filters: { 
                        video_type: video_type.id, 
                        limit: 25 
                    },
                    attributes: {
                        video_type_model: video_type
                    } 
                });
            videosCollection.fetch();
            window.app.addCollection('videos', videosCollection);
        });
    },
    _addVideosViews: function () {
        var videosCollections = window.app.getCollection('videos');
        videosCollection.each(function (videos_collection) {
            var videosView = new VideosView({ 
                model: videos_collection.attributes.video_type_model,
                collection: videos_collection 
            });
            this.addView('videos', videosView);
        }, this);
    }
}));