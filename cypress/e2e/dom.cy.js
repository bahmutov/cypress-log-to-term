/// <reference path="../../src/index.d.ts" />

import '../../commands'
import { stringifyObjectOrJquery } from '../../src/utils'

chai.config.truncateThreshold = 200

describe('jQuery objects', () => {
  it('stringifies jQuery', () => {
    const $el = Cypress.$('<div id="obj" class="my-object">Hello</div>')
    const s = stringifyObjectOrJquery($el)
    expect(s, 'div').to.equal('$ of 1 <div#obj.my-object />')
  })

  it('logs jQuery subject', () => {
    const $el = Cypress.$('<div id="obj" class="my-object">Hello</div>')
    cy.wrap($el).log()
  })

  it('logs DOM element', () => {
    cy.visit('cypress/index.html')
    cy.get('h1').log()
    cy.get('p').log()
  })

  it('logs multiple elements', () => {
    cy.visit('cypress/index.html')
    cy.get('#people li').log()
  })

  it('logs with format string', () => {
    cy.visit('cypress/index.html')
    cy.get('#people li').log('list of people %o')
  })
})
