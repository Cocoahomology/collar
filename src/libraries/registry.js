import { ethers } from 'ethers'
import pools from './pools'

export default class registry {
  constructor(profile) {
    this.token = {}
    this.pool = {}
    this.address = {}
    this.config = {}

    switch (profile) {
      case 'localhost':
      case '192.168.1.165':
      case '192.168.100.2':
      case 'yzkonchain.github.io':
      case 'test.app.collar.org':
        // this.token['0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131'] = {
        //   name: 'Collar Governance Token',
        //   symbol: 'COLLAR',
        //   decimals: 18,
        // }
        // this.token['0xbA944D9198b44b2bDdfF005450E894829468EE51'] = {
        //   name: 'USD T',
        //   symbol: 'USDT',
        //   decimals: 18,
        // }
        // this.token['0x66CC925C4bEc43191294eb1c8f5975F6e18e9264'] = {
        //   name: 'USD C',
        //   symbol: 'USDC',
        //   decimals: 18,
        // }
        // this.token['0x713D0803f0ee0543871bDaa62A108DE711584f11'] = {
        //   name: 'CALL USDT -> USDC',
        //   symbol: 'CALL',
        //   decimals: 18,
        // }
        // this.token['0x1993EDA157207b60208e910c738aF1a63F46B0F8'] = {
        //   name: 'COLL USDT -> USDC',
        //   symbol: 'COLL',
        //   decimals: 18,
        // }
        // this.token['0xC491FC5fDa92bF60fce293e3cF2D511bCc1b74c0'] = {
        //   name: 'CALL USDC -> USDT',
        //   symbol: 'CALL',
        //   decimals: 18,
        // }
        // this.token['0xEB106C73F056D6E2d72D6BF811e1786756c8E619'] = {
        //   name: 'COLL USDC -> USDT',
        //   symbol: 'COLL',
        //   decimals: 18,
        // }
        // this.token['0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27'] = {
        //   name: 'Collar Liquidity Proof Token',
        //   symbol: 'CLPT',
        //   decimals: 18,
        // }
        // this.token['0x19a3efB70C87F08312e17736638D4DF13d0c9653'] = {
        //   name: 'Collar Liquidity Proof Token',
        //   symbol: 'CLPT',
        //   decimals: 18,
        // }
        // this.pool['0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27'] = {
        //   addr_bond: '0xbA944D9198b44b2bDdfF005450E894829468EE51',
        //   addr_want: '0x66CC925C4bEc43191294eb1c8f5975F6e18e9264',
        //   addr_call: '0x713D0803f0ee0543871bDaa62A108DE711584f11',
        //   addr_coll: '0x1993EDA157207b60208e910c738aF1a63F46B0F8',
        //   addr_collar: '0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131',
        //   swap_sqp: 992187500,
        //   expiry_time: 1633017600,
        // }
        // this.pool['0x19a3efB70C87F08312e17736638D4DF13d0c9653'] = {
        //   addr_bond: '0x66CC925C4bEc43191294eb1c8f5975F6e18e9264',
        //   addr_want: '0xbA944D9198b44b2bDdfF005450E894829468EE51',
        //   addr_call: '0xC491FC5fDa92bF60fce293e3cF2D511bCc1b74c0',
        //   addr_coll: '0xEB106C73F056D6E2d72D6BF811e1786756c8E619',
        //   addr_collar: '0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131',
        //   swap_sqp: 992187500,
        //   expiry_time: 1633017600,
        // }
        // this.address['default'] = '0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27'
        this.token['0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE'] = {
          name: 'Collar Governance Token',
          symbol: 'COLLAR',
          decimals: 18,
        }
        this.token['0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0'] = {
          name: 'USD T',
          symbol: 'USDT',
          decimals: 18,
        }
        this.token['0x67C9a0830d922C80A96408EEdF606c528836880C'] = {
          name: 'USD C',
          symbol: 'USDC',
          decimals: 18,
        }
        this.token['0x9D8FEb661AFc92b83c45fC21836C114164beB285'] = {
          name: 'CALL USDT -> USDC',
          symbol: 'CALL',
          decimals: 18,
        }
        this.token['0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'] = {
          name: 'COLL USDT -> USDC',
          symbol: 'COLL',
          decimals: 18,
        }
        this.token['0x404Ced902eE6d630db51969433ea7DD2EE3524B8'] = {
          name: 'CALL USDC -> USDT',
          symbol: 'CALL',
          decimals: 18,
        }
        this.token['0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D'] = {
          name: 'COLL USDC -> USDT',
          symbol: 'COLL',
          decimals: 18,
        }
        this.token['0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'] = {
          name: 'Collar Liquidity Proof Token',
          symbol: 'CLPT',
          decimals: 18,
        }
        this.token['0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90'] = {
          name: 'Collar Liquidity Proof Token',
          symbol: 'CLPT',
          decimals: 18,
        }
        this.pool['0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'] = {
          addr_bond: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
          addr_want: '0x67C9a0830d922C80A96408EEdF606c528836880C',
          addr_call: '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
          addr_coll: '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
          addr_collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
          swap_sqp: 992187500,
          expiry_time: 1633017600,
        }
        this.pool['0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90'] = {
          addr_bond: '0x67C9a0830d922C80A96408EEdF606c528836880C',
          addr_want: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
          addr_call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
          addr_coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
          addr_collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
          swap_sqp: 992187500,
          expiry_time: 1633017600,
        }
        this.address['default'] = '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'
        this.config.infuraid = '9180c5a422ac44f9b21ad7927b6b662c'
        // this.config.network = 'kovan'
        // this.config.chainid = 42
        this.config.network = 'ropsten'
        this.config.chainid = 3
        break
      default:
        this.token['0x5FbDB2315678afecb367f032d93F642f64180aa3'] = {
          name: 'Collar Governance Token',
          symbol: 'COLLAR',
          decimals: 18,
        }
        this.token['0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'] = {
          name: 'USD X',
          symbol: 'USDX',
          decimals: 18,
        }
        this.token['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'] = {
          name: 'USD Y',
          symbol: 'USDY',
          decimals: 18,
        }
        this.token['0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'] = {
          name: 'CALL USDX -> USDY',
          symbol: 'CALL',
          decimals: 18,
        }
        this.token['0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'] = {
          name: 'COLL USDX -> USDY',
          symbol: 'COLL',
          decimals: 18,
        }
        this.token['0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'] = {
          name: 'Collar Liquidity Proof Token',
          symbol: 'CLPT',
          decimals: 18,
        }
        this.pool['0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'] = {
          addr_bond: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          addr_want: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          addr_call: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
          addr_coll: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
          addr_collar: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          swap_sqp: 992187500,
          expiry_time: 4000000000,
        }
        this.address['default'] = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
        this.config.infuraid = '9180c5a422ac44f9b21ad7927b6b662c'
        this.config.network = 'mainnet'
        this.config.chainid = 31337
        break
    }
  }

  get_default_states() {
    return {
      balance: {
        bond: ethers.constants.Zero,
        want: ethers.constants.Zero,
        call: ethers.constants.Zero,
        coll: ethers.constants.Zero,
        clpt: ethers.constants.Zero,
        collar: ethers.constants.Zero,
      },
      allowance: {
        bond: ethers.constants.Zero,
        want: ethers.constants.Zero,
      },
    }
  }
  async get_current_states(signer, pool) {
    const s = this.get_default_states()
    const me = await signer.getAddress()
    const abi = [
      'function balanceOf(address) external view returns (uint256)',
      'function allowance(address, address) external view returns (uint256)',
    ]
    const bond = new ethers.Contract(this.pool[pool].addr_bond, abi, signer)
    const want = new ethers.Contract(this.pool[pool].addr_want, abi, signer)
    const call = new ethers.Contract(this.pool[pool].addr_call, abi, signer)
    const coll = new ethers.Contract(this.pool[pool].addr_coll, abi, signer)
    const clpt = new ethers.Contract(pool, abi, signer)
    const collar = new ethers.Contract(this.pool[pool].addr_collar, abi, signer)
    ;[
      s.balance.bond,
      s.balance.want,
      s.balance.call,
      s.balance.coll,
      s.balance.clpt,
      s.balance.collar,
      s.allowance.bond,
      s.allowance.want,
    ] = await Promise.all([
      bond.balanceOf(me),
      want.balanceOf(me),
      call.balanceOf(me),
      coll.balanceOf(me),
      clpt.balanceOf(me),
      collar.balanceOf(me),
      bond.allowance(me, pool),
      want.allowance(me, pool),
    ])
    return s
  }
}
