// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
// @ts-check

const { formatTitle, stringifyObjectOrJquery } = require('./src/utils')

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  const log = Cypress.log({ name: 'log', message: '' })
  // @ts-ignore
  let subject = Cypress.state('subject')

  let formatted = formatPattern
  if (typeof formatPattern === 'string') {
    formatted = formatTitle(formatPattern, subject)
  } else if (typeof formatPattern === 'function') {
    // @ts-ignore
    formatted = formatPattern(subject)
    if (typeof formatted !== 'string') {
      formatted = stringifyObjectOrJquery(formatted)
    }
  } else {
    formatted = stringifyObjectOrJquery(subject)
  }

  log.set('message', formatted)

  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  const clean = [formatted, ...args].join(', ').replaceAll('**', '')
  cy.task('print', clean, { log: false }).then(() => {
    return subject
  })
})
