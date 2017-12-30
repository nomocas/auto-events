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

function checkAttribute(node, ctrl, attrib) {
	const matched = eventAttributeMatcher.exec(attrib.name);
	let parsed;
	if (matched) {
		const eventType = matched[1];
		debug('bind event (%s) with : %s : on : ', eventType, attrib.value, ctrl);
		if (autoEvents.devMode) { // immediate parsing and check of events
			parsed = parsed || functionCallParser.parse(attrib.value);
			isAllowedMethod(parsed.method, ctrl);
		}

		node.addEventListener(eventType, e => {
			if (!autoEvents.devMode) { // lazzy parsing and check of events 
				parsed = parsed || functionCallParser.parse(attrib.value);
				isAllowedMethod(parsed.method, ctrl);
			}
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
autoEvents.install = function($ = window.jQuery) {
	$.fn.autoEvents = function autoEvents(ctrl) {
		this.get().forEach(node => bindEvents(node, ctrl));
		return this;
	};
};

module.exports = autoEvents;
