// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

// to avoid relying on old polyfills for node "format"
// use a custom formatter plus our own code
const format = require('string-format')
const stringify = require('safe-stable-stringify')

function formatTitle(pattern, x) {
  if (pattern.includes('{}') || pattern.includes('{0}')) {
    x = stringify(x)
  }
  if (pattern.includes('%d')) {
    return pattern.replace('%d', x)
  }
  if (pattern.includes('%o')) {
    return pattern.replace('%o', stringify(x))
  }
  return format(pattern, x)
}

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  const log = Cypress.log({ name: 'log', message: '' })
  const subject = Cypress.state('subject')

  let formatted = formatPattern
  if (typeof formatPattern === 'string') {
    formatted = formatTitle(formatPattern, subject)
  } else if (typeof formatPattern === 'function') {
    formatted = formatPattern(subject)
    if (typeof formatted !== 'string') {
      formatted = stringify(formatted)
    }
  } else {
    formatted = stringify(subject)
  }

  log.set('message', formatted)

  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  const clean = [formatted, ...args].join(', ').replaceAll('**', '')
  cy.task('print', clean, { log: false }).then(() => {
    return subject
  })
})
