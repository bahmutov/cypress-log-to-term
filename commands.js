// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
// @ts-check

const { formatLog } = require('./src/utils')

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  // @ts-ignore
  let subject = Cypress.state('subject')
  const { short, full } = formatLog(formatPattern, subject)

  const log = Cypress.log({
    name: 'log',
    message: short,
    $el: Cypress.dom.isJquery(subject) ? subject : null,
    consoleProps() {
      return {
        log: full,
        subject,
      }
    },
  })

  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  const clean = [full, ...args].join(', ').replaceAll('**', '')
  cy.task('print', clean, { log: false }).then(() => {
    return subject
  })
})
