'use strict';

var _ = require('underscore'),
    Backbone = require('../modules/backbone-jquery');

function ObservableList(list) {
    this._list = [];
    if (list) this._list.push(list);
    this.length = this._list.length;
}

ObservableList.prototype = _.extend(Backbone.Events, {
    push: function (data, options) {
        if (!data) return;
        options = options || {};
        this.listenTo(data, 'all', this._proxyEvent());
        this._list.push(data);
        this.length = this._list.length;
        if (!options.silent) this.trigger('obs:add', this, data);
        return this;
    },
    pop: function (options) {
        if (_.isEmpty(this._list)) return;
        options = options || {};
        var data = this._list.pop();
        this.length = this._list.length;
        this.stopListening(data);
        if (!options.silent) this.trigger('obs:remove', this, data);
        return data;
    },
    remove: function (data, options) {
        if (!data) return this;
        options = options || {};
        this._list = _.without(this._list, data);
        this.length = this._list.length;
        this.stopListening(data);
        if (!options.silent) this.trigger('obs:remove', this, data);
        return this;
    },
    removeAt: function (index, options) {
        if (!index && index !== 0) return;
        options = options || {};
        var data = this._list.splice(index, 1);
        this.length = this._list.length;
        this.stopListening(data);
        if (!options.silent) this.trigger('obs:remove', this, data);
        return data;
    },
    removeAll: function (options) {
        this.stopListening();
        var oldList = this._list;
        this._list = [];
        this.length = this._list.length;
        if (!options.silent) {
            _.each(oldList, function (item) {
                this.trigger('obs:remove', this, item);
            }, this);
        }
        return this;
    },
    at: function (index) {
        if (!index && index !== 0) return;
        return this._list[index];
    },
    sort: function (iteratee, options) {
        if (_.isEmpty(this._list)) return this;
        options = options || {};
        _.sortBy(this._list, iteratee || function (item) { return item; });
        if (!options.silent) this.trigger('obs:sort', this);
        return this;
    },
    _proxyEvent: function () {
        var eventHandler = function (event, object, value) {
            this.trigger(event, object, value);
        };
        return _.bind(eventHandler, this);
    }
});

var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample', 'groupBy', 'countBy', 'sortBy', 
    'indexBy'];

_.each(methods, function(method) {
    ObservableList.prototype[method] = function() {
        var args = slice.call(arguments);
        args.unshift(this._list);
        return _[method].apply(_, args);
    };
});

module.exports = ObservableList;