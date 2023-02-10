// to avoid relying on old polyfills for node "format"
// use a custom formatter plus our own code
const format = require('string-format')
const stringify = require('safe-stable-stringify')

function formatTitle(pattern, x) {
  if (pattern.includes('{}') || pattern.includes('{0}')) {
    x = stringifyObjectOrJquery(x)
  }
  if (pattern.includes('%d')) {
    return pattern.replace('%d', x)
  }
  if (pattern.includes('%o')) {
    return pattern.replace('%o', stringifyObjectOrJquery(x))
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
  }${attrs ? ' ' + attrs : ''} />`
}

function stringifyjQuery(subject) {
  let s = `$ of ${subject.length}`
  if (subject.length) {
    const elements = subject.toArray()
    if (subject.length > 3) {
      // skip the middle elements
      const els =
        '[' +
        stringifyDomElement(elements[0]) +
        '...' +
        stringifyDomElement(elements.at(-1)) +
        ']'
      s += ' ' + els
    } else {
      const els = elements.map(stringifyDomElement).join(',')
      s += ' ' + els
    }
  }
  const maxLength = chai.config.truncateThreshold || 200
  if (s.length > maxLength) {
    return s.slice(0, maxLength) + '...'
  }
  return s
}

function stringifyObjectOrJquery(subject) {
  debugger
  if (Cypress.dom.isJquery(subject)) {
    return stringifyjQuery(subject)
  } else {
    return stringify(subject)
  }
}

module.exports = {
  formatTitle,
  stringifyObjectOrJquery,
}
