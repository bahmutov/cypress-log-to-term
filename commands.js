// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
// @ts-check

const { formatTitle, stringifyObjectOrJquery } = require('./src/utils')

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  const log = Cypress.log({ name: 'log', message: '' })
  // @ts-ignore
  let subject = Cypress.state('subject')

  let short = formatPattern
  let full = formatPattern
  if (typeof formatPattern === 'string') {
    short = full = formatTitle(formatPattern, subject)
  } else if (typeof formatPattern === 'function') {
    // @ts-ignore
    short = formatPattern(subject)
    if (typeof short !== 'string') {
      const stringified = stringifyObjectOrJquery(short)
      short = stringified.short
      if (stringified.full) {
        full = stringified.full
      } else {
        full = short
      }
    }
  } else {
    const stringified = stringifyObjectOrJquery(subject)
    short = stringified.short
    if (stringified.full) {
      full = stringified.full
    } else {
      full = short
    }
  }

  log.set('message', short)

  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  const clean = [full, ...args].join(', ').replaceAll('**', '')
  cy.task('print', clean, { log: false }).then(() => {
    return subject
  })
})
