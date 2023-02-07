declare namespace Cypress {
  interface Chainable {
    /**
     * Prints the current subject and yields it to the next command or assertion.
     * @see https://github.com/bahmutov/cypress-log-to-term
     * @see https://github.com/davidchambers/string-format
     * @param format Optional format string, supports "%" and "{}" notation
     * @example
     *  cy.wrap(42)
     *    .log('the answer is %d')
     *    .should('equal', 42)
     * @example
     *  cy.wrap({ name: 'Joe' }).log('person %o')
     * @example
     *  cy.wrap({ name: 'Joe' }).log('person {}')
     * @example
     *  cy.wrap({ name: 'Joe' }).log('person {0}')
     * @example
     *  cy.wrap({ name: { first: 'Joe' } }).log('Hello, {0.name.first}')
     * @example
     *  cy.wrap(arr).log('array length {0.length}')
     */
    log(format?: string | Function): Chainable<any>
  }
}
