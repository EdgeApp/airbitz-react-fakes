/* global
describe it
*/

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai
const { FakeTxEngine, FakeTxEnginePrivate } = require('../dist/index.js')
const ABCTxLibAccess = {
  accountDataStore: {},
  walletDataStore: {}
}
const options = {
  masterPrivateKey: 'PRIVATEgjXJSvjNRSLic2xvcep9AP9n1UKwC2CwmXb3Y5sSNspyr',
  masterPublicKey: 'PUBLICDgjXJSvjNRSLic2xvcep9AP9n1UKwC2CwmXb3Y5sSNspyr'
}
const callbacks = {
  abcWalletTxAddressesChecked: (ABCWalletTx, progressRatio) => {
      // console.log(progressRatio)
  },
  abcWalletTxTransactionsChanged: (abcTransactions) => {
      // console.log(abcTransactions)
  },
  abcWalletTxBlockHeightChanged: (ABCWalletTx, height) => {
      // console.log(height)
  }
}
const fakeTxEngine = new FakeTxEngine(ABCTxLibAccess, options, callbacks)

process.stdout.write('\x1Bc')

describe('FakeTxEngine', () => {
  describe('getTokenStatus', () => {
    it('should return true if tokens are enabled', () => {
      const expected = false
      const actual = fakeTxEngine.getTokenStatus()

      expect(actual).to.equal(expected)
    })

    it('should enable token status', () => {
      const expected = ['TATIANACOIN']
      fakeTxEngine.enableTokens({
        tokens: expected
      })
      .then(
        (actual) => { return expect(actual).to.eql(expected) },
        (error) => { console.log(error) })
      .catch((error) => {
        console.log(error)
      })
    })
  })

  describe('getBalance', () => {
    it('should return current balance', () => {
      const expected = 58
      const actual = fakeTxEngine.getBalance()

      expect(actual).to.equal(expected)
    })
  })

  describe('getNumTransactions', () => {
    it('should return number of transactions', () => {
      const expected = FakeTxEnginePrivate.transactions.length
      const actual = fakeTxEngine.getNumTransactions()

      expect(actual).to.equal(expected)
    })
  })

  describe('getTransactions', () => {
    it('should return list of transactions', () => {
      const expected = FakeTxEnginePrivate.transactions.toString()
      fakeTxEngine.getTransactions()
      .then(
        (actual) => { return expect(actual.toString()).to.eql(expected) },
        (error) => { console.log(error) })
      .catch((error) => {
        console.log(error)
      })
    })
  })

  describe('getFreshAddress', () => {
    it('should return an unused/non-reserved addressed', () => {
      const expected = '1this_is_a_fresh_address1111111111'
      const actual = fakeTxEngine.getFreshAddress()

      expect(actual).to.equal(expected)
    })
  })

  describe('addGapLimitAddresses', () => {
    it('should return true', () => {
      const expected = true
      const actual = fakeTxEngine.addGapLimitAddresses()

      expect(actual).to.equal(expected)
    })
  })

  describe('isAddressUsed', () => {
    const usedAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    const freshAddress = '1this_is_a_fresh_address1111111111'

    it('should return true for a used address', () => {
      const expected = true
      const actual = fakeTxEngine.isAddressUsed(usedAddress)

      expect(actual).to.equal(expected)
    })
    it('should return false for a fresh address', () => {
      const expected = false
      const actual = fakeTxEngine.isAddressUsed(freshAddress)

      expect(actual).to.equal(expected)
    })
  })

  describe('signTx', () => {
    it('should set an unsigned transaction to signed', () => {
      const unsignedTx = FakeTxEnginePrivate.getNewTransaction()

      expect(fakeTxEngine.signTx(unsignedTx)).to.eventually.have.property(
        'signedTx', '1234567890123456789012345678901234567890123456789012345678901234')
    })
  })

  describe('makeSpend', () => {
    it('should return a transaction with correct amountSatoshi', () => {
      const abcSpendInfo = {
        currencyCode: 'BTC',
        noUnconfirmed: false,
        spendTargets: [
          {
            address: '1CsaBND4GNA5eeGGvU5PhKUZWxyKYxrFqs',
            amountSatoshi: 10000000 // 0.1 BTC
          },
          {
            address: '1CsaBND4GNA5eeGGvU5PhKUZWxyKYxrFqs',
            amountSatoshi: 110000000 // 1.1 BTC
          }
        ],
        networkFeeOption: 'high'
      }

      const expectedAmountSatoshi = 10000000 + 110000000
      const newTransaction = fakeTxEngine.makeSpend(abcSpendInfo)

      expect(newTransaction.amountSatoshi).to.equal(expectedAmountSatoshi)
    })
  })

  describe('async testing', () => {
    it('should increase the numTransactions when a new transaction is detected', () => {
      const before = fakeTxEngine.getNumTransactions()
      FakeTxEnginePrivate.addNewTransaction()
      const after = fakeTxEngine.getNumTransactions()

      expect(after).to.equal(before + 1)
    })

    it('should update the balance when a new transaction is detected', () => {
      const newTransaction = FakeTxEnginePrivate.getTransactions()[0]
      const newAmount = newTransaction.amountSatoshi

      const before = fakeTxEngine.getBalance()
      FakeTxEnginePrivate.addNewTransactions([newTransaction])
      const after = fakeTxEngine.getBalance()

      expect(after).to.equal(before + newAmount)
    })

    it('should update the blockHeight when a new transaction is detected', () => {
      const before = fakeTxEngine.getBlockHeight()
      FakeTxEnginePrivate.addNewBlock()
      const after = fakeTxEngine.getBlockHeight()

      expect(after).to.equal(before + 1)
    })
  })
})
