import { formatTitle, formatLog } from '../../src/utils'

chai.config.truncateThreshold = 400

describe('formatTitle', () => {
  it('formats a number with %d', () => {
    const r = formatTitle('number is %d', 42)
    expect(r).to.deep.equal({
      short: 'number is 42',
      full: 'number is 42',
    })
  })
})

describe('formatLog', () => {
  it('returns the given string', () => {
    const r = formatLog('Hello')
    expect(r).to.deep.equal({
      short: 'Hello',
      full: 'Hello',
    })
  })

  it('formats a number with %d', () => {
    const r = formatLog('number is %d', 42)
    expect(r).to.deep.equal({
      short: 'number is 42',
      full: 'number is 42',
    })
  })

  it('formats subject without a string', () => {
    const r = formatLog(undefined, 42)
    expect(r).to.deep.equal({
      short: '42',
      full: '42',
    })
  })
})
