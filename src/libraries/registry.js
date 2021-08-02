import { ethers } from 'ethers'
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
        this.token['0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131'] = {
          name: 'Collar Governance Token',
          symbol: 'COLLAR',
          decimals: 18,
        }
        this.token['0x28003e9C3583BA8e31Ce0042DBb85b8a7a4543E5'] = {
          name: 'USD X',
          symbol: 'USDX',
          decimals: 18,
        }
        this.token['0xae12f6016A3A64afC12CE5F23203FA6b9ce0f1Dd'] = {
          name: 'USD Y',
          symbol: 'USDY',
          decimals: 18,
        }
        this.token['0xfd17C3c5Ee35E907eB7C9A01C5A168f985b7F026'] = {
          name: 'CALL USDX -> USDY',
          symbol: 'CALL',
          decimals: 18,
        }
        this.token['0x8bb96D1D27fCe63ED2791655D1188a885c392Db3'] = {
          name: 'COLL USDX -> USDY',
          symbol: 'COLL',
          decimals: 18,
        }
        this.token['0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'] = {
          name: 'Collar Liquidity Proof Token',
          symbol: 'CLPT',
          decimals: 18,
        }
        this.pool['0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'] = {
          addr_bond: '0x28003e9C3583BA8e31Ce0042DBb85b8a7a4543E5',
          addr_want: '0xae12f6016A3A64afC12CE5F23203FA6b9ce0f1Dd',
          addr_call: '0xfd17C3c5Ee35E907eB7C9A01C5A168f985b7F026',
          addr_coll: '0x8bb96D1D27fCe63ED2791655D1188a885c392Db3',
          addr_collar: '0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131',
          swap_sqp: 992187500,
          expiry_time: 1627909600,
        }
        this.address['default'] = '0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'
        this.config.infuraid = '9180c5a422ac44f9b21ad7927b6b662c'
        this.config.network = 'kovan'
        this.config.chainid = 42
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
