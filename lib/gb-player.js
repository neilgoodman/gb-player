'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('./modules/backbone-jquery'),
    Bootstrap = require('bootstrap'),
    ObservableHash = require('./modules/observable-hash'),
    NavigationView = require('./views/navigation-view'),
    PageView = require('./views/page-view'),
    VideoTypesView = require('./views/video-types-view');

var GBPlayer = function () {
    this.collections = new ObservableHash();
    this.views = new ObservableHash();
};

GBPlayer.prototype = {
    initialize: function () {
        this.addEventListeners();
        this.render();
    },
    render: function () {
        this.removeAllViews();
        var navigationView = new NavigationView(),
            pageView = new PageView();

        this.addView('navigation-view', navigationView, 'body');
        this.addView('page-view', pageView, 'body');

        //pageView.addView(new VideoTypesView());

        this.trigger('render');
        return this;
    },
    getCollection: function (key) {
        return this.collections.key(key);
    },
    addCollection: function (key, collection) {
        this.collections.add(key, collection);
        return this;
    },
    removeCollection: function (key) {
        var collection = this.collection.removeKey(key);
        return collection;
    },
    getView: function (key) {
        return this.views.key(key);
    },
    addView: function (key, view, selector) {
        this.views.add(key, view);
        if (selector) $(selector).append(view.el);
        return this;
    },
    removeView: function (key, view) {
        var view = this.views.removeKey(key);
        return view;
    },
    removeAllViews: function () {
        this.views.removeAll();
    },
    addEventListeners: function () {
        this.listenTo(this.collections, 'all', _.triggerCollectionEvent, this);
        this.listenTo(this.views, 'all', _.triggerViewEvent, this);

        this.listenTo(this.collections, 'obs:remove', function (hash, collection) {
            collection.stopListening();
        });

        this.listenTo(this.views, 'obs:remove', function (hash, view) {
            view.remove();
        });
    },
    removeEventListeners: function () {
        this.stopListening(this.collections);
        this.stopListening(this.views);
    },
    _triggerCollectionEvent: function (event, value, key) {
        this.trigger('collection:' + event, value, key);
    } ,
    _triggerViewEvent: function (event, value, key) {
        this.trigger('view:' + event, value, key);
    }
};

_.extend(GBPlayer.prototype, Backbone.Events);

$(function () {
    window.app = new GBPlayer();
    window.app.initialize();
});