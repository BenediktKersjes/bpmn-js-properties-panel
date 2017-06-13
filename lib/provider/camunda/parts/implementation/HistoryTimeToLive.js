'use strict';

var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var historyTimeToLiveEntry = entryFactory.validationAwareTextField({
    id: 'historyTimeToLive',
    label: translate('History Time To Live'),
    modelProperty: 'historyTimeToLive',

    getProperty: function(element, node) {
      var bo = getBusinessObject(element);
      var historyTimeToLive = bo.get('camunda:historyTimeToLive');

      return historyTimeToLive ? toString(historyTimeToLive) : '';
    },

    setProperty: function(element, values) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'camunda:historyTimeToLive': toInt(values.historyTimeToLive) || undefined
      });
    },

    validate: function(element, values, node) {
      var validation = {};

      if (values.historyTimeToLive && !isInt(toInt(values.historyTimeToLive))) {
        validation.historyTimeToLive = 'Time must be an integer';
      }

      return validation;
    }
  });

  return [ historyTimeToLiveEntry ];
};

function toInt(string) {
  return Number(string);
}

function toString(number) {
  return String(number);
}

function isInt(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
}
