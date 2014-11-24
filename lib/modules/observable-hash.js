'use strict';

var _ = require('underscore'),
    Backbone = require('../modules/backbone-jquery'),
    ObservableList = require('./observable-list');

function ObservableHash(hash) {
    if (hash) {
        this._hash = _.clone(hash);
    }
    else {
        this._hash = {};
    }
}

ObservableHash.prototype = _.extend(Backbone.Events, {
    add: function (key, value, options) {
        if (!key || !value) return this;
        options = options || {};

        if (this._hash[key] && this._hash[key] instanceof ObservableList) {
            this._hash[key].push(value);
        }
        else if (this._hash[key] && !(this._hash[key] instanceof ObservableList)) {
            var originalValue = this._hash[key];
            this.stopListenting(originalValue);
            this._hash[key] = new ObservableList();
            this._hash[key].push(originalValue, { silent: true });
            this._hash[key].push(value, { silent: true });
            this.listenTo(this._hash[key], 'all', this._proxyEvent(key, { list: true}));
        }
        else {
            this.listenTo(value, 'all', this._proxyEvent(key));
            this._hash[key] = value;
        }

        if (!options.silent) this.trigger('obs:add', value, this._hash[key] instanceof ObservableList ? key + '[]' : key);
        return this;
    },
    removeKey: function (key, options) {
        if (!key || !_.has(this._hash, key)) return;
        options = options || {};
        var value = this._hash[key];
        delete this._hash[key];
        this.stopListenting(value);
        if (value.removeAll) value.removeAll({ silent: true });
        if (!options.silent) this.trigger('obs:remove', value, key);
        return value;
    },
    removeAll: function (options) {
        if (_.isEmpty(this._hash)) return this;
        this.stopListening();
        var oldHash = this._hash;
        this._hash = {};
        if (!options.silent) {
            _.each(oldHash, function (value, key) {
                if (value.removeAll) value.removeAll({ silent: true });
                this.trigger('obs:remove', this, value, key);
            }, this);
        }
        return this;
    },
    key: function (key) {
        return this._hash[key];
    },
    _proxyEvent: function (key, options) {
        options = options || {};
        var eventHandler = function (key, event, object, value) {
            this.trigger(event, this, object, value, options.list ? key + '[]' : key);
        };
        return _.bind(eventHandler, this, key);
    }
});

var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'head', 'take', 'tail', 'drop', 'shuffle',
    'isEmpty', 'chain', 'sample', 'groupBy', 'countBy', 'sortBy', 
    'indexBy', 'has'];

_.each(methods, function(method) {
    ObservableHash.prototype[method] = function() {
        var args = slice.call(arguments);
        args.unshift(this._list);
        return _[method].apply(_, args);
    };
});

module.exports = ObservableHash;