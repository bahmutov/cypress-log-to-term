/// <reference path="../../src/index.d.ts" />

import '../../commands'

describe('circular', () => {
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
})
