// to avoid relying on old polyfills for node "format"
// use a custom formatter plus our own code
const format = require('string-format')
const stringify = require('safe-stable-stringify')

function formatTitle(pattern, x) {
  if (
    typeof x === 'string' ||
    typeof x === 'number' ||
    typeof x === 'boolean'
  ) {
    x = {
      short: x,
      full: x,
    }
  }

  if (pattern.includes('{}') || pattern.includes('{0}')) {
    x = stringifyObjectOrJquery(x)
  }
  if (pattern.includes('%d') && x) {
    return {
      short: pattern.replace('%d', x.short),
      full: pattern.replace('%d', x.full),
    }
  }
  if (pattern.includes('%o') && x) {
    x = stringifyObjectOrJquery(x)
    return {
      short: pattern.replace('%o', x.short),
      full: pattern.replace('%o', x.full),
    }
  }

  const s = format(pattern, x)
  return {
    short: s,
    full: s,
  }
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

function stringifyDomElementWithText(el) {
  const attrs = stringifyDomAttributes(el)
  const text = el.innerText
  const tag = el.tagName.toLowerCase()
  if (text.length < 30) {
    return `<${tag}${el.id ? '#' + el.id : ''}${
      el.className ? '.' + el.className : ''
    }${attrs ? ' ' + attrs : ''}>${text}</${tag}>`
  } else {
    return `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
      el.className ? '.' + el.className : ''
    }${attrs ? ' ' + attrs : ''} />`
  }
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

function stringifyjQueryWithText(subject) {
  let s = `$ of ${subject.length}`
  if (subject.length) {
    const elements = subject.toArray()
    if (subject.length > 3) {
      // skip the middle elements
      const els =
        '[' +
        stringifyDomElementWithText(elements[0]) +
        '...' +
        stringifyDomElementWithText(elements.at(-1)) +
        ']'
      s += ' ' + els
    } else {
      const els = elements.map(stringifyDomElementWithText).join(',')
      s += ' ' + els
    }
  }
  const maxLength = 2000
  if (s.length > maxLength) {
    return s.slice(0, maxLength) + '...'
  }
  return s
}

function stringifyObjectOrJquery(subject) {
  if (Cypress.dom.isJquery(subject)) {
    return {
      short: stringifyjQuery(subject),
      full: stringifyjQueryWithText(subject),
    }
  } else {
    const s = stringify(subject)
    return { short: s, full: s }
  }
}

function formatLog(formatPattern, subject) {
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

  return { short, full }
}

module.exports = {
  formatLog,
  formatTitle,
  stringifyObjectOrJquery,
}
