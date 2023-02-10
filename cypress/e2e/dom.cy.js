/// <reference path="../../src/index.d.ts" />

import '../../commands'

chai.config.truncateThreshold = 200

describe('jQuery objects', () => {
  it('logs jQuery subject', () => {
    cy.wrap(Cypress.$('<div id="obj" class="my-object">Hello</div>')).log()
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

  it.only('logs with format string', () => {
    cy.visit('cypress/index.html')
    cy.get('#people li').log('list of people %o')
  })
})
