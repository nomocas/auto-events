/* global $ */
/* eslint no-console:0 */
const autoEvents = require('../src/index');

// autoEvents.parseMethod('delete(foo)'); /*?.*/
// autoEvents.parseMethod('send(foo, 23)'); /*?*/
// autoEvents.parseMethod('bar'); /*?*/
// autoEvents.parseMethod('goo(hop)'); /*?*/

/** Mock node */

class Node {
	constructor() {
		this.events = 0;
		this.attributes = [{
			name: 'data-ev-click',
			value: 'delete(12)'
		}];
	}

	addEventListener(type, handler, bubbleing = false) {
		this.events++;
		console.log('addEventListener', type, typeof handler === 'function', bubbleing);
	}
}

autoEvents.bindEvents(new Node(), {
	init() {
		$(this.root).find('> button.delete').autoEvents(this);
	},
	hide() {
		this.root.classList.toggle('is-active');
	}
});
