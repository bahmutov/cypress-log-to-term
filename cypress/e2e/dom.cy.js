/// <reference path="../../src/index.d.ts" />

import '../../commands'
import { stringifyObjectOrJquery } from '../../src/utils'

chai.config.truncateThreshold = 200

describe('jQuery objects', () => {
  it('stringifies jQuery', () => {
    const $el = Cypress.$('<div id="obj" class="my-object">Hello</div>')
    const o = stringifyObjectOrJquery($el)
    expect(o).to.be.an('object').and.have.keys(['short', 'full'])
    expect(o.short, 'short text').to.equal('$ of 1 <div#obj.my-object />')
    expect(o.full, 'full text').to.equal(
      '$ of 1 <div#obj.my-object>Hello</div>',
    )
  })

  it('logs jQuery subject', () => {
    const $el = Cypress.$('<div id="obj" class="my-object">Hello</div>')
    cy.wrap($el).log()
  })

  it('logs DOM element', () => {
    cy.visit('cypress/index.html')
    cy.get('h1').log()
    cy.get('p').log()
  })

  it('logs multiple elements', () => {
    cy.visit('cypress/index.html')
    cy.get('#people li').log()
  })

  it('logs with format string', () => {
    cy.visit('cypress/index.html')
    cy.get('#people li').log('list of people %o')
  })
})
