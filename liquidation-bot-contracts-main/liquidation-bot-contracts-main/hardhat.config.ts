import { task } from 'hardhat/config'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber } from 'ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-truffle5'
import 'hardhat-deploy'
import * as dotenv from 'dotenv'

dotenv.config()
const DEPLOYER = process.env.CONTRACT_DEPLOYER

// When using the hardhat network, you may choose to fork Fuji or Avalanche Mainnet
// This will allow you to debug contracts using the hardhat network while keeping the current network state
// To enable forking, turn one of these booleans on, and then run your tasks/scripts using ``--network hardhat``
// For more information go to the hardhat guide
// https://hardhat.org/hardhat-network/
// https://hardhat.org/guides/mainnet-forking.html
const FORK_FUJI = false
const FORK_MAINNET = true
const forkingData = FORK_FUJI
  ? {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
    }
  : FORK_MAINNET
  ? {
      url: 'https://api.avax.network/ext/bc/C/rpc',
    }
  : undefined

task('accounts', 'Prints the list of accounts', async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach((account: SignerWithAddress): void => {
    console.log(account.address)
  })
})

task('balances', 'Prints the list of AVAX account balances', async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  for (const account of accounts) {
    const balance: BigNumber = await hre.ethers.provider.getBalance(account.address)
    console.log(`${account.address} has balance ${balance.toString()}`)
  }
})

export default {
  solidity: {
    compilers: [
      {
        version: '0.4.24',
      },
      {
        version: '0.5.16',
      },
      {
        version: '0.6.2',
      },
      {
        version: '0.6.4',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.7.0',
      },
      {
        version: '0.8.0',
      },
    ],
  },
  networks: {
    hardhat: {
      gasPrice: 290463691164,
      networkId: !forkingData ? 43112 : undefined, //Only specify a chainId if we are not forking
      forking: forkingData,
    },
    mainnet: {
      url: 'http://localhost:8545/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 31337,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [],
    },
    local: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [],
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 10000000000,
      gasMultiplier: 2,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 200000,
  },
}
