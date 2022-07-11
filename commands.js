// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

Cypress.Commands.overwrite('log', (log, message, ...args) => {
  // print the to Cypress Command Log
  // to preserve the existing functionality
  log(message, ...args)
  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  cy.task('print', [message, ...args].join(', '), { log: false })
})
