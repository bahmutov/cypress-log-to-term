// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
// @ts-check

const { formatTitle, stringifyObjectOrJquery } = require('./src/utils')

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  // @ts-ignore
  let subject = Cypress.state('subject')

  let short = formatPattern
  let full = formatPattern
  if (typeof formatPattern === 'string') {
    const stringified = formatTitle(formatPattern, subject)
    short = stringified.short
    full = stringified.full
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

  const log = Cypress.log({
    name: 'log',
    message: short,
    consoleProps() {
      return {
        log: full,
      }
    },
  })
  // log.set('message', short)

  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  const clean = [full, ...args].join(', ').replaceAll('**', '')
  cy.task('print', clean, { log: false }).then(() => {
    return subject
  })
})
