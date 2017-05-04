/* global describe it */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai
const { FakeWallet } = require('../dist/index.js')

process.stdout.write('\x1Bc')

describe('FakeWallet', () => {
  const walletId = 0
  const walletType = 'repo.wallet.fakeWallet'
  const walletName = 'walletName'
  const walletKeys = ['master_private_key', 'master_public_key']
  const wallet = new FakeWallet(walletType, walletName, walletKeys, walletId)

  describe('initial properties', () => {
    it('initializes with a walletId', () => {
      const expected = walletId
      const actual = wallet.walletId

      expect(actual).to.equal(expected)
    })

    it('initializes with a walletType', () => {
      const expected = walletType
      const actual = wallet.walletType

      expect(actual).to.equal(expected)
    })

    it('initializes with a walletName', () => {
      const expected = walletName
      const actual = wallet.walletName

      expect(actual).to.equal(expected)
    })
  })

  describe('instance methods', () => {
    describe('renameWallet', () => {
      it('changes the name of the wallet', () => {
        const newWalletName = 'newWalletName'

        wallet.renameWallet(newWalletName)
        .then(() => {
          return expect(wallet.walletName).to.equal(newWalletName)
        })
      })
    })

    // describe('addTxFunctionality', () => {
    //   it('', () => {
    //     const result = account.checkPassword(correctPassword)
    //     .then((actual) => {
    //       return expect(actual).to.equal(true)
    //     })
    //
    //     return result
    //   })
    // })
  })
})
