/* global describe it */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai
const { FakeAccount, FakeWallet } = require('../dist/index.js')

process.stdout.write('\x1Bc')

describe('FakeAccount', () => {
  const username = 'bob19'
  const correctPassword = 'funtimes19'
  const incorrectPassword = 'sadtimes19'
  const account = new FakeAccount(username, correctPassword)
  const walletKeys = ['master_private_key', 'master_public_key']
  const walletIds = [0, 1, 2, 3, 4]
  account.walletList = walletIds.map(id => {
    return new FakeWallet('type' + id, 'wallet' + id, walletKeys, id) // eslint-disable-line no-new
  })

  describe('initial properties', () => {
    it('initializes with a username', () => {
      const expected = username
      const actual = account.username

      expect(actual).to.equal(expected)
    })
  })

  describe('instance methods', () => {
    describe('checkPassword', () => {
      it('return true for a correct password', () => {
        const result = account.checkPassword(correctPassword)
        .then((actual) => {
          return expect(actual).to.equal(true)
        })

        return result
      })

      it('return true for a incorrect password', () => {
        const result = account.checkPassword(incorrectPassword)
        .then((actual) => {
          return expect(actual).to.equal(false)
        })

        return result
      })
    })

    describe('listWalletIds', () => {
      it('returns a list of walletIds', () => {
        const expected = [0, 1, 2, 3, 4]
        const actual = account.listWalletIds()

        expect(actual).to.eql(expected)
      })
    })

    describe('getWallet', () => {
      it('returns a wallet matching a given id', () => {
        const targetWalletId = account.walletList.length
        const expected = new FakeWallet('type' + targetWalletId, 'name' + targetWalletId, ['private', 'public'], targetWalletId)
        account.walletList.push(expected)
        const actual = account.getWallet(targetWalletId)

        expect(actual).to.eql(expected)
      })
    })

    describe('getFirstWallet', () => {
      it('returns the first wallet that matches a given type', () => {
        const expected = account.walletList[3]
        const actual = account.getFirstWallet('type3')

        expect(actual).to.eql(expected)
      })
    })

    describe('createWallet', () => {
      it('returns the walletId', () => {
        const type = 'repo.wallet.bitcoin'
        const keys = [123, 456]
        const expected = ((account.listWalletIds()[account.listWalletIds().length - 1]) + 1)

        account.createWallet(type, keys).then(actual => {
          return expect(actual).to.equal(expected)
        })
      })
    })
  })
})
