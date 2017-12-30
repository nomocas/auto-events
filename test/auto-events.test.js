/* global describe, it, expect */
const autoEvents = require('../src/index');

// autoEvents.parseMethod('delete(foo)'); /*?.*/
// autoEvents.parseMethod('send(foo, 23)'); /*?*/
// autoEvents.parseMethod('bar'); /*?*/
// autoEvents.parseMethod('goo(hop)'); /*?*/

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

describe('manage missing method', () => {
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

