/* global describe, it, expect, afterEach */
const autoEvents = require('../src/index');

/** Mock node */
class Node {
	constructor(attributes) {
		this.events = 0;
		this.attributes = attributes;
	}

	addEventListener(type, handler, bubbleing = false) {
		this.events++;
		this[type] = handler;
		this.bubbleing = bubbleing;
	}
}

class Event {
	constructor(type) {
		this.type = type;
	}
}



afterEach(() => {
	autoEvents.devMode = false;
});
describe('should bind click event', () => {
	const node = new Node([{
		name: 'data-ev-click',
		value: 'delete(12)'
	}]);
	const controller = {
		delete(e, value) {
			this.firedEvent = e;
			this.deleted = value;
		}
	};
	
	autoEvents.bindEvents(node, controller);

	it('set exactly one event', () => {
		expect(node.events).toBe(1);
	});
	it('set the good event', () => {
		expect(typeof node.click).toBe('function');
	});
	it('forward the argument from caller function', () => {
		node.click();
		expect(controller.deleted).toBe(12);
	});
	it('forward an event as first argument', () => {
		const event = new Event('click');
		node.click(event);
		expect(controller.firedEvent).toBe(event);
	});
});

describe('manage missing method (no devMode)', () => {
	const node = new Node([{
		name: 'data-ev-click',
		value: 'delete()'
	}]);
	const controller = {
	};
	autoEvents.bindEvents(node, controller);

	it('should throw if method not found', () => {
		expect(() => node.click()).toThrow();
	});
});

describe('manage missing method (devMode)', () => {
	const node = new Node([{
		name: 'data-ev-click',
		value: 'delete()'
	}]);
	const controller = {
	};

	it('should throw if method not found', () => {
		autoEvents.devMode = true;
		expect(() => autoEvents.bindEvents(node, controller)).toThrow();
	});
});

describe('skip non event attribute', () => {
	const node = new Node([{
		name: 'foo',
		value: 'bar'
	}]);
	autoEvents.bindEvents(node, {});

	it('do nothing', () => {
		expect(node).toBe(node);
	});
});

function simulateClick(elem) {
	const evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	elem.dispatchEvent(evt);
}

describe('bind through dom queries', () => {
	document.body.innerHTML = `<div id="app" data-ev-click="delete(3)"></div>`;

	const controller = {
		delete(e, value) {
			this.firedEvent = e;
			this.deleted = value;
		}
	};
	autoEvents.bindEvents('#app', controller);
	simulateClick(document.getElementById('app'));
	it('should have fired controller.delete', () => {
		expect(controller.deleted).toBe(3);
	});
});


describe('bind through direct jquery reference', () => {
	const $ = require('jquery');

	document.body.innerHTML = `<div id="app" data-ev-click="delete(3)"></div>`;

	autoEvents.install($);

	const controller = {
		delete(e, value) {
			this.firedEvent = e;
			this.deleted = value;
		}
	};
	$('#app').autoEvents(controller);
	$('#app').click();
	it('should have fired controller.delete', () => {
		expect(controller.deleted).toBe(3);
	});
});

describe('install through window.jquery', () => {
	const $ = require('jquery');
	window.$ = $;
	document.body.innerHTML = `<div id="app" data-ev-click="delete(3)"></div>`;

	autoEvents.install();

	const controller = {
		delete(e, value) {
			this.firedEvent = e;
			this.deleted = value;
		}
	};
	$('#app').autoEvents(controller);
	$('#app').click();
	it('should have fired controller.delete', () => {
		expect(controller.deleted).toBe(3);
	});
});
