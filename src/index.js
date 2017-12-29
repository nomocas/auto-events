/**
 * # AutoEvents
 *
 * Auto bind events on DOM nodes with methods from a controller.
 *
 * A controller is just a simple object with at least an "init" function that take no arguments.
 * aka :
 * ```javascript
 * module.exports = {
 *    init() { ... }
 * };
 * ```
 *
 * @TODO: Add data-ev-init : immediate execution on initialisation
 */

/* eslint curly:0, no-param-reassign:0 */
const debug = require('debug')('autoevents');
const functionCallParser = require('elenpi-simple-function-call-parser').default;
const eventAttributeMatcher = /^data-ev-([\w\d-_]+)/;

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
		node.addEventListener(eventType, e => {
			parsed = parsed || functionCallParser.parse(attrib.value);
			isAllowedMethod(parsed.method, ctrl);
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

module.exports = {
	bindEvents,
	install($ = window.jQuery) {
		$.fn.autoEvents = function autoEvents(ctrl) {
			this.get().forEach(node => bindEvents(node, ctrl));
			return this;
		};
	}
};
