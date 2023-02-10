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

function stringifyDomAttributes(el) {
  if (!el.attributes.length) {
    return ''
  }
  return Cypress._.map(el.attributes, (a) => {
    if (a.nodeName === 'id' || a.nodeName === 'class') {
      return
    }
    return a.nodeName + '=' + a.nodeValue
  })
    .filter(Boolean)
    .join(' ')
}

function stringifyDomElement(el) {
  const attrs = stringifyDomAttributes(el)
  return `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
    el.className ? '.' + el.className : ''
  }${attrs ? ' ' + attrs : ''}/>`
}

Cypress.Commands.overwrite('log', (logCommand, formatPattern, ...args) => {
  const log = Cypress.log({ name: 'log', message: '' })
  let subject = Cypress.state('subject')

  let formatted = formatPattern
  if (typeof formatPattern === 'string') {
    formatted = formatTitle(formatPattern, subject)
  } else if (typeof formatPattern === 'function') {
    formatted = formatPattern(subject)
    if (typeof formatted !== 'string') {
      formatted = stringify(formatted)
    }
  } else if (Cypress.dom.isJquery(subject)) {
    formatted = `$ of ${subject.length}`
    if (subject.length) {
      const els = subject.toArray().map(stringifyDomElement).join(',')
      formatted += ' ' + els
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
