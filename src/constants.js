// export const pools = {
//   addr_bond: '0x28003e9C3583BA8e31Ce0042DBb85b8a7a4543E5',
//   addr_want: '0xae12f6016A3A64afC12CE5F23203FA6b9ce0f1Dd',
//   addr_call: '0xfd17C3c5Ee35E907eB7C9A01C5A168f985b7F026',
//   addr_coll: '0x8bb96D1D27fCe63ED2791655D1188a885c392Db3',
//   addr_collar: '0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131',
// }

const _abi = [
  'function transfer(address, uint256) external',
  'function approve(address, uint256) external',
  'function balanceOf(address) external view returns (uint256)',
  'function allowance(address, address) external view returns (uint256)',
]

export const pools = [
  {
    pid: 0,
    token: 'coll',
    address: '0x8bb96D1D27fCe63ED2791655D1188a885c392Db3',
    abi: _abi,
    balance: 0,
    eventName: 'redeem',
    buttonText: 'Redeem All',
  },
  {
    pid: 1,
    token: 'call',
    address: '0xfd17C3c5Ee35E907eB7C9A01C5A168f985b7F026',
    abi: _abi,
    balance: 0,
    eventName: 'repay',
    buttonText: 'Repay All',
  },
]

export const clpts = [
  {
    pid: 0,
    token: 'clpt',
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    abi: _abi,
    balance: 0,
  },
]
