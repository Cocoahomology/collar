import { BigNumber, ethers } from 'ethers'
import collar from '../config/abi/collar'
import { useContext, useEffect, useState } from 'react'
import { Context } from '@/store'
import {
  Box,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import DynamicFont from 'react-dynamic-font'
import { makeStyles } from '@material-ui/core/styles'
import { MyDivInfo, FloatMessage2, MyButtonWhite } from '@/components/modules'
import { iconInfo, TotalValueIcon, GlobalIcon } from '@/assets/svg'
import { poolList } from '../libraries/pools'
import Pools from '../libraries/pools'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px auto',
    //Mobile
    '@media screen and (max-width:960px)': {
      width: 'calc(100% - 40px)',
      padding: '0 20px',
    },
    //PC
    '@media screen and (min-width:960px)': {
      width: '900px',
    },
  },
  totalValue: {
    display: 'flex',
    alignItems: 'center',
    '&>div': {
      '&:first-child': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '180px',
        margin: '10px 0',
        fontSize: '20px',
        fontFamily: 'Gillsans',
        color: '#fff',
        '&>div': {
          display: 'flex',
          '&>img': {
            width: '20px',
          },
          '&>span': {
            marginLeft: '10px',
          },
        },
        '&>img': {
          width: '14px',
        },
      },
      '&:last-child': {
        fontSize: '24px',
        fontFamily: 'Gillsans',
        color: '#4975FF',
        marginLeft: '30px',
      },
    },
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  globalValue: {
    fontFamily: 'Gillsans',
    display: 'flex',
    alignItems: 'start',
    margin: '10px 0',
    '&>div': {
      '&:first-child': {
        fontSize: '20px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        width: '180px',
        '&>img': {
          width: '20px',
        },
        '&>span': {
          marginLeft: '10px',
        },
      },
      '&:last-child': {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: '30px',
        width: '710px',
        '@media screen and (max-width:960px)': {
          width: 'calc(100% - 30px)',
        },
      },
    },
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  globalValueInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(50% - 10px)',
    '&>div:first-child': {
      color: '#7B96EB',
      marginBottom: '5px',
      width: '100%',
    },
    '&>div:last-child': {
      color: 'white',
      backgroundColor: '#111C3C',
      padding: '6px',
      width: '100%',
      boxSizing: 'border-box',
    },
  },
  yourBalance: {
    '&>div:first-child': {
      fontSize: '20px',
      fontFamily: 'Gillsans',
      color: '#fff',
      marginBottom: '10px',
    },
    '&>div:last-child': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>div': {
        display: 'flex',
        width: 'calc(50% - 10px)',
        justifyContent: 'space-between',
        '&>div': {
          width: 'calc(50% - 10px)',
        },
      },
      '@media screen and (max-width:960px)': {
        flexDirection: 'column',
        '&>div': {
          width: '100%',
        },
      },
    },
  },
  detailTable: {
    '&>div:first-child': { fontSize: '20px', fontFamily: 'Gillsans', color: '#fff', margin: '10px 0' },
    '&>div:last-child': {
      '& tr': {
        borderBottom: 'white 1px solid',
      },
      '& th,& td': {
        color: 'white',
        padding: 0,
        border: 'none',
        fontSize: '18px',
        fontFamily: 'Gillsans',
        whiteSpace: 'nowrap',
        paddingRight: '20px',
      },
      '& button': {
        width: '133px',
      },
    },
  },
  infoTable: {
    '@media screen and (max-width:960px)': {
      display: 'none',
    },
    margin: '10px 0',
    '& tr': {
      borderBottom: 'white 1px solid',
    },
    '& th,& td': {
      color: 'white',
      padding: '0',
      paddingRight: '20px',
      border: 'none',
      whiteSpace: 'nowrap',
      fontFamily: 'Gillsans',
      fontSize: '18px',
    },
    '& button': {
      width: '133px',
    },
  },
  infoTableMobile: {
    '@media screen and (min-width:960px)': {
      display: 'none',
    },
    fontFamily: 'Gillsans',
    fontSize: '18px',
    color: 'white',
    '& button': {
      width: '133px',
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '10px 0',
    paddingRight: '0 !important',
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },
})

const getContract = (address, signer) => {
  return new ethers.Contract(address, collar, signer)
}
const withLoss = (val) => {
  return val.mul(995).div(1000)
}

export default function MyPage() {
  const classes = useStyles()
  const {
    state: { registry, signer },
    setState,
  } = useContext(Context)
  const [pools, setPools] = useState([])
  const [clpts, setClpts] = useState([])
  const [price, setPrice] = useState({
    COLL: 1,
    USDT: 1,
    USDC: 1,
  })
  const [anchorEl, setAnchorEl] = useState({ totalValue: null })
  const getAddress = async () => {
    const address = await signer.getAddress()
    return address
  }
  const getBalance = (addr) => new ethers.Contract(addr, collar, signer)
  const transform = (num) => (parseFloat(num) / 1000000000000000000).toFixed(3)
  useEffect(() => {
    if (signer) {
      ;(async () => {
        const account = await getAddress()
        const res = await Promise.all(
          Pools.map(async (item) => {
            const sx = await getBalance(item.pool).sx()
            const sy = await getBalance(item.pool).sy()
            const sk = await getBalance(item.pool).sk()
            const coll_total = transform(sx)
            const want_total = transform(sy)
            const bond_total = transform(await getBalance(poolList[item.pool].bond.addr).balanceOf(item.pool))
            const earned = transform(await getBalance(item.pool).earned(account))
            const clpt_pre = await getBalance(item.pool).balanceOf(account)
            const [clpt_coll, clpt_want] = await getBalance(item.pool).get_dxdy(clpt_pre)
            const clpt = transform(clpt_pre)
            const call = transform(await getBalance(item.call).balanceOf(account))
            const coll = transform(await getBalance(item.coll).balanceOf(account))
            const receivbles =
              transform(clpt_coll) * price['COLL'] +
              transform(clpt_want) * price[poolList[item.pool].want.symbol] +
              coll * 1
            const shareOfPoll = `${((ethers.utils.formatEther(clpt_pre) / ethers.utils.formatEther(sk)) * 100).toFixed(
              2,
            )} %`
            const apr = '0.00%'
            const apy = `0.00%`
            return {
              pool: item.pool,
              clpt,
              call,
              coll,
              coll_total,
              want_total,
              bond_total,
              earned,
              receivbles,
              shareOfPoll,
              apr,
              apy,
            }
          }),
        ).catch((err) => {
          console.log(err)
          return []
        })
        setPools(res)
      })()
    }
  }, [signer])

  const redeem = async (pool) => {
    if (!signer) {
      return false
    }
    const contract = getContract(pool.pool, signer)
    const account = await getAddress()
    const call = await getContract(pool.call, signer).balanceOf(account)
    const coll = await getContract(pool.coll, signer).balanceOf(account)
    if (parseFloat(call) > parseFloat(coll)) {
      alert('COLL must larger than CALL!')
      return
    }
    const want = await contract.get_dy(call)
    contract
      .swap_coll_to_min_want(call, withLoss(want))
      .then((resp) => resp.wait())
      .then(async ({ status }) => {
        let coll = transform(await getBalance(pool.coll).balanceOf(account))
        switch (status) {
          case 1:
            alert('Success!')
            setPools(
              pools.map((item) => {
                return item.pool === pool.pool ? { ...item, coll } : item
              }),
            )
            break
          default:
            alert('Failed!')
        }
      })
      .catch(console.log)
  }

  const repay = async (pool) => {
    if (!signer) {
      return false
    }
    const contract = getContract(pool.pool, signer)
    const account = await getAddress()
    const call = await getContract(pool.call, signer).balanceOf(account)
    const coll = await getContract(pool.coll, signer).balanceOf(account)
    const want = await getContract(pool.want.addr, signer).balanceOf(account)
    if (parseFloat(call) > parseFloat(want)) {
      alert(`${pool.want.symbol} must larger than CALL!`)
      return
    }
    if (parseFloat(call) > parseFloat(coll)) {
      alert('COLL must larger than CALL!')
      return
    }
    await contract
      .burn_dual(call)
      .then((resp) => resp.wait())
      .then(async ({ status }) => {
        let coll = transform(await getBalance(pool.coll).balanceOf(account))
        let call = transform(await getBalance(pool.call).balanceOf(account))
        switch (status) {
          case 1:
            alert('Success!')
            setPools(
              pools.map((item) => {
                return item.pool === pool.pool ? { ...item, coll, call } : item
              }),
            )
            break
          default:
            alert('Failed!')
        }
      })
      .catch(console.log)
  }

  const withdraw = async (pool) => {
    if (!signer) {
      return false
    }
    const contract = getContract(pool.pool, signer)
    const account = await getAddress()
    const clpt = await contract.balanceOf(account)
    await contract
      .withdraw_both(clpt)
      .then((resp) => resp.wait())
      .then(async ({ status }) => {
        switch (status) {
          case 1:
            alert('Success!')
            setPools(
              pools.map((item) => {
                return item.pool === pool.pool ? { ...item, clpt: '0.000' } : item
              }),
            )
            break
          default:
            alert('Failed!')
        }
      })
      .catch(console.log)
  }

  const claim = async (pool) => {
    if (!signer) {
      return false
    }
    const contract = getContract(pool.pool, signer)
    await contract
      .claim_reward()
      .then((resp) => resp.wait())
      .then(async ({ status }) => {
        switch (status) {
          case 1:
            alert('Success!')
            setPools(
              pools.map((item) => {
                return item.pool === pool.pool ? { ...item, earned: '0.000' } : item
              }),
            )
            break
          default:
            alert('Failed!')
        }
      })
      .catch(console.log)
  }

  return (
    <div className={classes.root}>
      <div className={classes.totalValue}>
        <div>
          <div>
            <img src={TotalValueIcon} alt="" />
            <span>Total Value</span>
          </div>
          <img
            src={iconInfo}
            alt=""
            onMouseEnter={(e) => setAnchorEl({ totalValue: e.currentTarget })}
            onMouseLeave={() => setAnchorEl({ totalValue: null })}
          />
          <FloatMessage2 anchorEl={anchorEl['totalValue']} info={'TotalValue'} />
        </div>
        <div>
          $
          {pools.length
            ? pools
                .reduce((sum, cur) => {
                  return (
                    sum +
                    cur.coll_total * price['COLL'] +
                    cur.want_total * price[poolList[cur.pool].want.symbol] +
                    cur.bond_total * price[poolList[cur.pool].bond.symbol]
                  )
                }, 0)
                .toFixed(3)
            : 0}
        </div>
      </div>

      <div className={classes.globalValue}>
        <div>
          <img src={GlobalIcon} alt="" />
          <span>Global</span>
        </div>
        <div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Borrowed" />
            </div>
            <div>
              <DynamicFont
                content={`$${
                  pools.length
                    ? pools.reduce((sum, cur) => {
                        return sum + cur.coll_total * price['COLL']
                      }, 0)
                    : 0
                }`}
              />
            </div>
          </div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Collateral" />
            </div>
            <div>
              <DynamicFont
                content={`$${
                  pools.length
                    ? pools
                        .reduce((sum, cur) => {
                          return sum + cur.bond_total * price[poolList[cur.pool].bond.symbol]
                        }, 0)
                        .toFixed(3)
                    : 0
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: '#3B54A0 1px solid', width: '100%', margin: '10px 0 20px 0' }}></hr>

      <div className={classes.yourBalance}>
        <div>Your Balance</div>
        <div>
          <div>
            <MyDivInfo
              title="Outstanding Debt"
              remarks="*Value of Borrowed Asset"
              amount={pools
                .reduce((sum, cur) => {
                  return sum + cur.call * price[poolList[cur.pool].want.symbol]
                }, 0)
                .toFixed(3)}
              token="USD"
            />
            <MyDivInfo
              title="Depost Balance"
              remarks="*Value of Collateral"
              amount={pools
                .reduce((sum, cur) => {
                  return sum + cur.call * price[poolList[cur.pool].bond.symbol]
                }, 0)
                .toFixed(3)}
              token="USD"
            />
          </div>
          <div>
            <MyDivInfo
              title="Receivables"
              remarks="*Value of Lent Asset"
              amount={pools
                .reduce((sum, cur) => {
                  return sum + cur.receivbles
                }, 0)
                .toFixed(3)}
              token="USD"
            />
            <MyDivInfo
              title="Rewards"
              remarks="*Value of Claimable COLLAR"
              amount={pools
                .reduce((sum, cur) => {
                  return sum + cur.earned * 1
                }, 0)
                .toFixed(3)}
              token="COLLAR"
              color="#4975FF"
            />
          </div>
        </div>
      </div>

      <div className={classes.table}>
        {pools.map((val, key) => {
          const pool = poolList[val.pool]
          return (
            <div key={key} style={{ marginBottom: '40px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '20px', margin: '20px 0' }}
              >
                <img src={pool.bond.icon} style={{ width: '30px' }} />
                <img src={pool.want.icon} style={{ width: '30px' }} />
                {pool.bond.symbol}
                <span>/</span>
                {pool.want.symbol}
              </div>
              <div
                style={{
                  backgroundColor: '#2D4284',
                  borderRadius: '20px',
                  color: 'white',
                  padding: '5px',
                  textAlign: 'center',
                  fontFamily: 'Gillsans',
                }}
              >
                Expiry: {new Date(pool.expiry_time * 1000).toLocaleString()}
              </div>
              <div className={classes.detailTable}>
                <div>
                  <TableContainer component={Paper} style={{ background: 'none', boxShadow: 'none' }}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" style={{ paddingBottom: '10px' }}>
                            Token
                          </TableCell>
                          <TableCell align="center" style={{ paddingBottom: '10px' }}>
                            Balance
                          </TableCell>
                          <TableCell align="center" style={{ paddingBottom: '10px' }}>
                            APY
                          </TableCell>
                          <TableCell align="center">{}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left" component="th">
                            COLL
                          </TableCell>
                          <TableCell align="center">
                            <div>{val.coll}</div>
                            <div style={{ fontSize: '10px', color: '#99A8C9' }}>~${val.coll * price['COLL']}</div>
                          </TableCell>
                          <TableCell align="center">0%</TableCell>
                          <TableCell className={classes.buttonGroup}>
                            <MyButtonWhite name="Redeem All" onClick={() => redeem(pool)} />
                            <MyButtonWhite name="Settle" onClick={() => alert('Not support yet!')} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left" component="th">
                            CALL
                          </TableCell>
                          <TableCell align="center">
                            <div>{val.call}</div>
                            <div style={{ fontSize: '10px', color: '#99A8C9' }}>~${val.call * price['COLL']}</div>
                          </TableCell>
                          <TableCell align="center">0%</TableCell>
                          <TableCell className={classes.buttonGroup}>
                            <MyButtonWhite name="Repay All" onClick={() => repay(pool)} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div className={classes.infoTable}>
                <TableContainer component={Paper} style={{ background: 'none', boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Token</TableCell>
                        <TableCell align="center">Balance</TableCell>
                        <TableCell align="center">Share of Pool</TableCell>
                        <TableCell align="center">Claimable COLLAR</TableCell>
                        <TableCell align="center">APR</TableCell>
                        <TableCell align="center">APY</TableCell>
                        <TableCell align="right">{}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">COLL/{pool.want.symbol}</TableCell>
                        <TableCell align="center">{val.clpt}</TableCell>
                        <TableCell align="center">{val.shareOfPoll}</TableCell>
                        <TableCell align="center">{val.earned}</TableCell>
                        <TableCell align="center">{val.apr}</TableCell>
                        <TableCell align="center">{val.apy}</TableCell>
                        <TableCell className={classes.buttonGroup}>
                          <MyButtonWhite name={'Withdraw All'} onClick={() => withdraw(pool)} />
                          <MyButtonWhite name={'Claim'} onClick={() => claim(pool)} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className={classes.infoTableMobile}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>COLL/{pool.want.symbol}</div>
                  <div>{val.clpt}</div>
                  <div>{val.apy}</div>
                  <MyButtonWhite name={'Withdraw'} onClick={() => withdraw(pool)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: 'calc(100% - 150px)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#2D4284',
                        borderRadius: '15px',
                        margin: '5px 0',
                      }}
                    >
                      <span>Share of Pool</span>
                      <span>{val.shareOfPoll}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#2D4284',
                        borderRadius: '15px',
                        margin: '5px 0',
                      }}
                    >
                      <span>Claimable COLLAR</span>
                      <span>{val.earned}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#2D4284',
                        borderRadius: '15px',
                        margin: '5px 0',
                      }}
                    >
                      <span>APR</span>
                      <span>{val.apr}</span>
                    </div>
                  </div>
                  <MyButtonWhite name={'Claim'} onClick={() => claim(pool)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
