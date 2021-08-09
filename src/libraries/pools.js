this.token['0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131'] = {
  name: 'Collar Governance Token',
  symbol: 'COLLAR',
  decimals: 18,
}
this.token['0xbA944D9198b44b2bDdfF005450E894829468EE51'] = {
  name: 'USD T',
  symbol: 'USDT',
  decimals: 18,
}
this.token['0x66CC925C4bEc43191294eb1c8f5975F6e18e9264'] = {
  name: 'USD C',
  symbol: 'USDC',
  decimals: 18,
}
this.token['0x713D0803f0ee0543871bDaa62A108DE711584f11'] = {
  name: 'CALL USDT -> USDC',
  symbol: 'CALL',
  decimals: 18,
}
this.token['0x1993EDA157207b60208e910c738aF1a63F46B0F8'] = {
  name: 'COLL USDT -> USDC',
  symbol: 'COLL',
  decimals: 18,
}
this.token['0xC491FC5fDa92bF60fce293e3cF2D511bCc1b74c0'] = {
  name: 'CALL USDC -> USDT',
  symbol: 'CALL',
  decimals: 18,
}
this.token['0xEB106C73F056D6E2d72D6BF811e1786756c8E619'] = {
  name: 'COLL USDC -> USDT',
  symbol: 'COLL',
  decimals: 18,
}
this.token['0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27'] = {
  name: 'Collar Liquidity Proof Token',
  symbol: 'CLPT',
  decimals: 18,
}
this.token['0x19a3efB70C87F08312e17736638D4DF13d0c9653'] = {
  name: 'Collar Liquidity Proof Token',
  symbol: 'CLPT',
  decimals: 18,
}

const USDT = { addr: '0xbA944D9198b44b2bDdfF005450E894829468EE51', symbol: 'USDT' }
const USDC = { addr: '0x66CC925C4bEc43191294eb1c8f5975F6e18e9264', symbol: 'USDC' }
const collar = { addr: '0xBEc25Ed2BCEBB414413cb7767D106C6a7e413131', symbol: 'COLLAR' }

export default [
  {
    addr_pool: '0x8134223C8b69c0956fcf7EDA24A78b2fF6d34b27',
    addr_bond: USDT,
    addr_want: USDC,
    addr_call: '0x713D0803f0ee0543871bDaa62A108DE711584f11',
    addr_coll: '0x1993EDA157207b60208e910c738aF1a63F46B0F8',
    addr_collar: collar,
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
  {
    addr_pool: '0x19a3efB70C87F08312e17736638D4DF13d0c9653',
    addr_bond: USDC,
    addr_want: USDT,
    addr_call: '0xC491FC5fDa92bF60fce293e3cF2D511bCc1b74c0',
    addr_coll: '0xEB106C73F056D6E2d72D6BF811e1786756c8E619',
    addr_collar: collar,
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
]
