/**
 * # Post page init checker
 *
 * Check everything that could be checked on controllers and data-ev-* after full page init
 *
 * - detect when there is data-ev-* nodes that has not been binded
 * - produce report with unused controller's methods
 * - seek after all data-ev-* in full dom, mock all controllers, fire all events and check that
 *   all methods has been called
 */

module.exports = {};
