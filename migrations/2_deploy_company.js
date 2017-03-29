const AccountingLib = artifacts.require('AccountingLib.sol')
const BylawsLib = artifacts.require('BylawsLib.sol')
const VotingLib = artifacts.require('VotingLib.sol')
const Company = artifacts.require('Company.sol')
const CompanyFactory = artifacts.require('CompanyFactory.sol')
const CompanyConfiguratorFactory = artifacts.require('CompanyConfiguratorFactory.sol')
const VotingStock = artifacts.require('VotingStock.sol')
const NonVotingStock = artifacts.require('NonVotingStock.sol')
const GenericBinaryVoting = artifacts.require('GenericBinaryVoting.sol')
const BytesHelper = artifacts.require('BytesHelper.sol')
const VerifyLib = artifacts.require('VerifyLib.sol')

// const utils = require('ethereumjs-util')


module.exports = (deployer) => {
  let company = null

  /*
  const networks = {
    15: [web3.eth.accounts[0], 10e7],
    3: [web3.eth.accounts[0], 4.712e6],
    42: ['0x0031EDb4846BAb2EDEdd7f724E58C50762a45Cb2', 4.99e6],
  }

  const from = networks[web3.version.network][0]
  const gas = networks[web3.version.network][1]
  */

  // HD provider cannot do sync calls
  const from = '0x692c16ef3d640b8f5dcec895023b4fc294d85ab3'
  const gas = 4712000

  deployer.deploy(AccountingLib, { gas })
  deployer.link(AccountingLib, [Company, CompanyFactory])
  deployer.deploy(BylawsLib, { gas })
  deployer.link(BylawsLib, [Company, CompanyFactory])
  deployer.deploy(VotingLib)
  deployer.link(VotingLib, [Company, CompanyFactory])

  deployer.deploy(BytesHelper, { gas })
  deployer.link(BytesHelper, GenericBinaryVoting)

  deployer.deploy(CompanyConfiguratorFactory, { from, gas })
    .then(() => CompanyConfiguratorFactory.deployed())
    .then(c => conf = c)
    .then(() => deployer.deploy(CompanyFactory, conf.address, { from, gas }))
    .then(() => CompanyFactory.deployed())
    .then(f => {
      factory = f
      return conf.setFactory(factory.address, { from, gas })
    })
    /*
    .then(() => factory.deployCompany({ from, gas }))
    .then(r => {
      companyAddress = r.logs.filter(e => e.event === 'NewCompany')[0].args.companyAddress
      console.log('Company address: ', companyAddress)
      return conf.configureCompany(companyAddress, from, { from, gas })
    })
    */
}
