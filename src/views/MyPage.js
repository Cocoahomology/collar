import { ethers } from 'ethers'
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
import { pools as Pools, clpts as Clpts } from '../constants'

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
      width: '920px',
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
    width: 'calc(33.33% - 10px)',
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
        fontSize: '16px',
        whiteSpace: 'nowrap',
        paddingRight: '20px',
      },
      '& button': {
        width: '133px',
      },
    },
  },
  infoTable: {
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
      fontSize: '16px',
    },
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
  const [anchorEl, setAnchorEl] = useState({ totalValue: null })

  useEffect(() => {
    if (signer) {
      ;(async () => {
        const account = await signer.getAddress()
        setPools(
          await Promise.all(
            Pools.map(async (item) => {
              const contract = new ethers.Contract(item.address, item.abi, signer)
              const balance = await contract.balanceOf(account)
              return { ...item, balance: ethers.utils.formatUnits(balance, 'ether') }
            }),
          ).catch((err) => {
            console.log(err)
            return []
          }),
        )
      })()
      ;(async () => {
        const account = await signer.getAddress()
        setClpts[
          await Promise.all(
            Clpts.map(async (item) => {
              const contract = new ethers.Contract(item.address, item.abi, signer)
              // const balance = await contract.balanceOf(account)
              // return { ...item, balance: ethers.utils.formatUnits(balance, 'ether') }
            }),
          ).catch((err) => {
            console.log(err)
            return []
          })
        ]
      })()
    }
  }, [signer])

  const getAddress = async () => {
    const address = await signer.getAddress()
    console.log(address)
  }

  const redeem = async (pid, call) => {
    const contract = getContract('0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157', signer)
    const want = await contract.get_dy(call)
    await contract.swap_coll_to_min_want(call, withLoss(want)).catch(console.log)
    const updatePools = pools.map((item) => {
      return item.pid === pid ? { ...item, balance: 0 } : item
    })
    console.log(updatePools)
    setPools(updatePools)
  }

  const repay = async (pid, call) => {
    const contract = getContract('0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157', signer)
    await contract.burn_dual(call).catch(console.log)
  }

  const handleClick = (pid, eventName, balance) => {
    const _balance = ethers.utils.parseUnits(balance, 18)
    if (!signer) {
      return false
    }
    if (eventName === 'redeem') {
      return redeem(pid, _balance)
    }
    return repay(pid, _balance)
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
        <div>$894,399,229.942</div>
      </div>

      <div className={classes.globalValue}>
        <div>
          <img src={GlobalIcon} alt="" />
          <span>Global</span>
        </div>
        <div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Collateral" />
            </div>
            <div>
              <DynamicFont content="$712,869.000" />
            </div>
          </div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Borrow" />
            </div>
            <div>
              <DynamicFont content="$712,49.000" />
            </div>
          </div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Active Positions" />
            </div>
            <div>
              <DynamicFont content="$69.000" />
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
              amount="712,465,869.000"
              token="USD"
            />
            <MyDivInfo title="Depost Balance" remarks="*Value of Collateral" amount="712,465,869.000" token="USD" />
          </div>
          <div>
            <MyDivInfo title="Receivbles" remarks="*Value of Lent Asset" amount="712,465,869.000" token="USD" />
            <MyDivInfo
              title="Rewards"
              remarks="*Value of Claimable COLLAR"
              amount="712,465,869.000"
              token="COLLAR"
              color="#4975FF"
            />
          </div>
        </div>
      </div>

      <div className={classes.detailTable}>
        <div>USDT/USDC@2021/8/2</div>
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
                  <TableCell align="center">{}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pools.map((row) => (
                  <TableRow key={row.token}>
                    <TableCell align="left" component="th" scope="row">
                      {row.token}
                    </TableCell>
                    <TableCell align="center">
                      <div>{parseFloat(row.balance).toFixed(3)}</div>
                      <div style={{ fontSize: '10px', color: '#99A8C9' }}>~$456,233,000.234</div>
                    </TableCell>
                    <TableCell className={classes.buttonGroup}>
                      <MyButtonWhite
                        name={row.buttonText}
                        onClick={() => handleClick(row.pid, row.eventName, row.balance)}
                      />
                      <MyButtonWhite name={row.settle || 'settle'} onClick={() => console.log('settle')} />
                    </TableCell>
                  </TableRow>
                ))}
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
              {[
                {
                  tokenName: 'COLL',
                  balance: '$123',
                  share: '123%',
                  available: '233',
                  apr: '12%',
                  apy: '24%',
                },
              ].map((row) => (
                <TableRow key={row.tokenName}>
                  <TableCell align="left">{row.tokenName}</TableCell>
                  <TableCell align="center">{row.balance}</TableCell>
                  <TableCell align="center">{row.share}</TableCell>
                  <TableCell align="center">{row.available}</TableCell>
                  <TableCell align="center">{row.apr}</TableCell>
                  <TableCell align="center">{row.apy}</TableCell>
                  <TableCell className={classes.buttonGroup}>
                    <MyButtonWhite
                      name={row.buttonText || 'Withdraw All'}
                      // onClick={() => handleClick(row.pid, row.eventName, row.balance)}
                    />
                    <MyButtonWhite name={row.settle || 'settle'} onClick={() => console.log('settle')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
