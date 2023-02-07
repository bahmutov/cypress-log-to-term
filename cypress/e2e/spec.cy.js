// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import '../../commands'

it('prints log messages', function () {
  cy.log('Hello')
  cy.log('Hello', 'world')
})

it('removes **', () => {
  cy.log('**bold** **message**')
  // make sure to remove from every string
  cy.log('**bold**', '**message**')
})

it('yields the current subject', () => {
  cy.wrap(42).log().should('equal', 42)
})
