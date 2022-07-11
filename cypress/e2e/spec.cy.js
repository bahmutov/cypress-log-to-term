// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import '../../commands'

it('prints log messages', function () {
  cy.log('Hello')
  cy.log('Hello', 'world')
})
