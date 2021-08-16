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
    address: '0x8baee4256746Cb19BC5FeA8d3FF86cBd06617697',
    abi: _abi,
    balance: 0,
    eventName: 'redeem',
    buttonText: 'Redeem All',
  },
  {
    pid: 1,
    token: 'call',
    address: '0x5a1C0AE029bA5B8C5109ab1f44F3C1A2be241934',
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
    address: '0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27',
    abi: _abi,
    balance: 0,
  },
  {
    pid: 1,
    token: 'clpt',
    address: '0x19a3efB70C87F08312e17736638D4DF13d0c9653',
    abi: _abi,
    balance: 0,
  },
]
