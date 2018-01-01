/**
 * # AutoEvents
 *
 * Auto bind events on DOM nodes with methods from a controller.
 *
 */

/* eslint curly:0, no-param-reassign:0 */
const debug = require('debug')('autoevents');
const functionCallParser = require('elenpi-simple-function-call-parser/src/index');
const eventAttributeMatcher = /^data-ev-(\w+)/i;
const autoEvents = {
	devMode: false
};
function isAllowedMethod(name, ctrl) {
	if (!ctrl[name])
		throw new Error('method not found on component : ', name);
	return true;
}

function parseCallAndCheck(value, parsed, ctrl) {
	parsed = functionCallParser.parse(value);
	isAllowedMethod(parsed.method, ctrl);
	return parsed;
}

function checkAttribute(node, ctrl, attrib) {
	const matched = eventAttributeMatcher.exec(attrib.name);
	if (matched) {
		const eventType = matched[1];
		let parsed;		
		debug('bind event (%s) with : %s : on : ', eventType, attrib.value, ctrl);
		if (!parsed && autoEvents.devMode) // immediate parsing and check of events
			parsed = parseCallAndCheck(attrib.value, parsed, ctrl);

		node.addEventListener(eventType, e => {
			if (!parsed && !autoEvents.devMode) // lazzy parsing and check of events 
				parsed = parseCallAndCheck(attrib.value, parsed, ctrl);
				
			debug('binded event : %s ! : ', eventType, parsed.method, parsed.arguments);
			ctrl[parsed.method](e, ...parsed.arguments);
		});
	}
}

function bindEvents(node, ctrl) {
	if (typeof node === 'string')
		node = document.querySelector(node);
	[].slice.call(node.attributes)
		.forEach(attrib => checkAttribute(node, ctrl, attrib));
}

autoEvents.bindEvents = bindEvents;
autoEvents.install = function($ = window.$) {
	$.fn.autoEvents = function autoEvents(ctrl) {
		this.get().forEach(node => bindEvents(node, ctrl));
		return this;
	};
};

module.exports = autoEvents;
