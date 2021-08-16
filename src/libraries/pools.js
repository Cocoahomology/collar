import { iconUsdt, iconUsdc } from '@/assets/svg/token'

const USDT = { addr: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0', symbol: 'USDT', decimals: 18, icon: iconUsdt }
const USDC = { addr: '0x67C9a0830d922C80A96408EEdF606c528836880C', symbol: 'USDC', decimals: 18, icon: iconUsdc }
const collar = { addr: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE', symbol: 'COLLAR', decimals: 18 }

const pools = [
  {
    pool: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
    bond: USDT,
    want: USDC,
    call: '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
    coll: '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
    collar: collar,
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
  {
    pool: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
    bond: USDC,
    want: USDT,
    call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
    coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
    collar: collar,
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
]

const poolList = {}
const wantList = []
const bondList = []

pools.map((val, key) => {
  poolList[val.pool] = val
  bondList.push(val.bond)
  wantList.push(val.want)
})

export default pools
export { poolList, wantList, bondList }
