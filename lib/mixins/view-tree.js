'use strict';

var Backbone = require('../modules/backbone-jquery'),
    ObservableList = require('../modules/observable-list'),
    ObservableHash = require('../modules/observable-hash');

module.exports = {
    getView: function (key) {
        setupViewHash(this);
        if (!key) return this.views;
        return this.views.key(key);
    },
    addView: function (key, view, selector) {
        setupViewHash(this);
        this.views.add(key, view);
        var appendable = selector ? this.$(selector) : this.$el;
        appendable.append(view.el);
        return this;
    },
    removeView: function (key) {
        setupViewHash(this);
        var view = this.views.removeKey(key);
        return view;
    },
    removeAllViews: function () {
        setupViewHash(this);
        this.views.removeAll();
        return this;
    },
    invokeOnViews: function (method, args) {
        this.views.invoke(method, args);
    },
    remove: function () {
        this.removeAllViews();
        return this.__super__.remove.apply(this);
    } 
};

function setupViewHash(object) {
    if (!(object.views instanceof ObservableHash)) {
        object.views = new ObservableHash();
        object.listenTo(object.views, 'obs:remove', function (list, view) {
            view.remove();
        });
    };
}