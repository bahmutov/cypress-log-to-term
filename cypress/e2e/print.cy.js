/// <reference types="cypress" />
// @ts-check

import '../../commands'

describe('% notation', () => {
  it('prints a number by default', () => {
    cy.wrap(42)
      .log() // "42"
      // and yields the value
      .should('equal', 42)
  })

  it('prints a string by default', () => {
    cy.wrap('hello')
      .log() // "hello"
      .should('be.a', 'string')
  })

  it('prints an object by default', () => {
    cy.wrap({ name: 'Joe' }).log() // {"name":"Joe"}
  })

  it('formats a number using %d', () => {
    cy.wrap(42)
      .log('the answer is %d') // "the answer is 42"
      .should('equal', 42)
  })

  it('prints an object using %o notation', () => {
    cy.wrap({ name: 'Joe' }).log('person %o') // 'person {"name":"Joe"}'
  })

  it('prints an array of numbers', () => {
    cy.wrap([1, 2, 3]).log()
  })

  it('prints an array of strings', () => {
    cy.wrap(['one', 'two', 'three']).log()
  })
})

describe('{} notation', () => {
  it('prints an object using {0} notation', () => {
    cy.wrap({ name: 'Joe' })
      .log('person {0}') // 'person {"name":"Joe"}'
      .should('deep.equal', { name: 'Joe' })
  })

  it('prints a property using {0.name} notation', () => {
    cy.wrap({ name: 'Joe' })
      .log('person name {0.name}') // "person name Joe"
      .should('deep.equal', { name: 'Joe' })
  })

  it('prints a nested property using {0.foo.bar} notation', () => {
    cy.wrap({ name: { first: 'Joe' } })
      .log('first name is {0.name.first}') // "first name is Joe"
      .its('name.first')
      .should('equal', 'Joe')
  })

  it('prints the length of an array', () => {
    const arr = [1, 2, 3]
    cy.wrap(arr)
      .log('initial array length {0.length}')
      .its('length')
      .should('equal', 4)
      .log('updated array length {0}')
    setTimeout(() => {
      arr.push(4)
    }, 1000)
  })
})

describe('format callback', () => {
  it('passes the subject and prints the result', () => {
    const person = { name: 'Joe' }
    cy.wrap(person)
      .log((p) => `name is ${p.name}`)
      .its('name')
      .should('equal', 'Ann')
    setTimeout(() => {
      person.name = 'Ann'
    }, 1000)
  })

  it('can return an object to be stringified', () => {
    cy.wrap([1, 2, 3]).log((list) => list[1]) // "2"
    cy.wrap({ name: 'Me' }).log((x) => x) // {"name":"Me"}
  })
})
