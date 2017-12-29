/**
 *
 * # Controller Leaks Checker
 *
 * Test controller's auto nesting to check if any data-ev-* selector is leaking.
 *
 * Should be used in conjonction with multiple-controller-bind-on-same-node check.
 *
 * For all components with slot(s) : try auto nesting and launch tests.
 * If autoEvents is correctly setted, it should be a good indicator that component
 * is correctly encapsulated.
 *
 */

module.exports = {};
