/// <reference path="../../src/index.d.ts" />
// @ts-check

import '../../commands'

it('prints the subject', () => {
  cy.wrap({ name: 'Joe' }).log()
})

it('prints arrays', () => {
  cy.wrap([1, 'hello', { name: 'Joe' }]).log()
})

it('formats the subject and inserts into the string', () => {
  cy.wrap({ name: 'Joe' }).log('person is %o')
})

it('inserts value from the object into the string', () => {
  cy.wrap({ name: 'Joe' }).log('my name is {0.name}')
})

it('supports deep paths', () => {
  cy.wrap([{ name: 'Joe' }, { name: { first: 'Anna' } }]).log(
    'her name is {0.1.name.first}',
  )
})
