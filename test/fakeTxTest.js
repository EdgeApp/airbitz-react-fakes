/* global
describe it
*/

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai
const { FakeTxPrivate } = require('../dist/index.js')
const { FakeTx } = require('../dist/index.js')

process.stdout.write('\x1Bc')

describe('FakeTx', () => {
  describe('getInfo', () => {
    it('returns info about the library', () => {
      const expected = FakeTxPrivate.getInfo.toString()
      const actual = FakeTx.getInfo().toString()

      expect(actual).to.equal(expected)
    })
  })

  describe('createMasterKeys', () => {
    it('returns a set of master keys', () => {
      const expected = [
        'master_private_key',
        'master_public_key'
      ]
      const actual = FakeTx.createMasterKeys()

      expect(actual).to.eql(expected)
    })
  })
})
