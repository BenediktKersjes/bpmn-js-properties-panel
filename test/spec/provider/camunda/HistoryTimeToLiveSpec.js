'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('../../../../lib'),
    domQuery = require('min-dom/lib/query'),
    domClasses = require('min-dom/lib/classes'),
    coreModule = require('bpmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection'),
    modelingModule = require('bpmn-js/lib/features/modeling'),
    propertiesProviderModule = require('../../../../lib/provider/camunda'),
    camundaModdlePackage = require('camunda-bpmn-moddle/resources/camunda'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

function toInt(string) {
  return Number(string);
}


describe('historyTimeToLive', function() {
  var testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container,
      getTextField;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('process', function() {
    var diagramXML = require('./HistoryTimeToLiveProcess.bpmn');

    beforeEach(bootstrapModeler(diagramXML, {
      modules: testModules,
      moddleExtensions: { camunda: camundaModdlePackage }
    }));

    beforeEach(inject(function(commandStack, propertiesPanel) {

      var undoButton = document.createElement('button');
      undoButton.textContent = 'UNDO';

      undoButton.addEventListener('click', function() {
        commandStack.undo();
      });

      container.appendChild(undoButton);

      propertiesPanel.attachTo(container);

      getTextField = function() {
        return domQuery('input[name=historyTimeToLive]', propertiesPanel._container);
      };
    }));


    it('should fetch a history time to live for a process', inject(function(propertiesPanel, selection, elementRegistry) {

      // given
      var shape = elementRegistry.get('Process_1'),
          inputEl = 'input[name=historyTimeToLive]';

      // when
      selection.select(shape);
      var bo = getBusinessObject(shape),
          inputValue = toInt(domQuery(inputEl, propertiesPanel._container).value);

      // then
      expect(bo.get('historyTimeToLive')).to.equal(inputValue);
    }));


    it('should set a history time to live on a process', inject(function(propertiesPanel, selection, elementRegistry) {

      var shape = elementRegistry.get('Process_1'),
          inputEl = 'input[name=historyTimeToLive]';

      // given
      selection.select(shape);

      var inputElement = domQuery(inputEl, propertiesPanel._container),
          bo = getBusinessObject(shape);

      // when
      TestHelper.triggerValue(inputElement, 200, 'change');

      // then
      expect(bo.get('historyTimeToLive')).to.equal(200);
    }));


    describe('validation errors', function() {


      it('should not be shown if time is valid', inject(function(propertiesPanel) {

        // given
        var inputEl = 'input[name=historyTimeToLive]';

        var inputElement = domQuery(inputEl, propertiesPanel._container);

        // when
        TestHelper.triggerValue(inputElement, 100, 'change');

        // then
        expect(domClasses(getTextField()).has('invalid')).to.be.false;
      }));


      it('should be shown if time is invalid', inject(function(propertiesPanel) {

        // given
        var inputEl = 'input[name=historyTimeToLive]';

        var inputElement = domQuery(inputEl, propertiesPanel._container);

        // when
        TestHelper.triggerValue(inputElement, 'foo', 'change');

        // then
        expect(domClasses(getTextField()).has('invalid')).to.be.true;
      }));

    });

  });


  describe('Participant', function() {
    var diagramXML = require('./HistoryTimeToLiveParticipant.bpmn');

    beforeEach(bootstrapModeler(diagramXML, {
      modules: testModules,
      moddleExtensions: { camunda: camundaModdlePackage }
    }));


    beforeEach(inject(function(commandStack, propertiesPanel) {

      var undoButton = document.createElement('button');
      undoButton.textContent = 'UNDO';

      undoButton.addEventListener('click', function() {
        commandStack.undo();
      });

      container.appendChild(undoButton);

      propertiesPanel.attachTo(container);
    }));


    it('should get the history time to live of a process in a participant', inject(function(propertiesPanel, selection, elementRegistry) {

      // given
      var shape = elementRegistry.get('Participant_1'),
          inputEl = 'input[name=historyTimeToLive]';

      // when
      selection.select(shape);

      var inputValue = toInt(domQuery(inputEl, propertiesPanel._container).value),
          shapeBo = getBusinessObject(shape).get('processRef');

      // then
      expect(shapeBo.get('historyTimeToLive')).to.equal(inputValue);
    }));


    it('should set the history time to live of a process in a participant', inject(function(propertiesPanel, selection, elementRegistry) {

      // given
      var shape = elementRegistry.get('Participant_1'),
          inputEl = 'input[name=historyTimeToLive]';

      selection.select(shape);

      var inputElement = domQuery(inputEl, propertiesPanel._container),
          shapeBo = getBusinessObject(shape).get('processRef');

      // when
      TestHelper.triggerValue(inputElement, 200, 'change');

      // then
      expect(shapeBo.get('historyTimeToLive')).to.equal(200);
    }));

  });

});
