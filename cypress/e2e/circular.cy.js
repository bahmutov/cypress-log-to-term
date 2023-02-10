/// <reference path="../../src/index.d.ts" />

import '../../commands'

it('logs circular object', () => {
  const obj = {
    name: 'object',
  }
  obj.next = obj
  // try to log a circular object
  cy.wrap(obj, { log: false })
    .log()
    .log('with format string')
    .log('circular %o')
})

it('logs jQuery subject', () => {
  cy.wrap(Cypress.$('<div id="obj" class="my-object">Hello</div>')).log()
})

it('logs DOM element', () => {
  cy.visit('cypress/index.html')
  cy.get('h1').log()
})
