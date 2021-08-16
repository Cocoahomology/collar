import { useCallback, useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { Context } from '@/store'
import { BigNumber, ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/modules'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import { iconInfo, iconUsdt, iconUsdc, ArrowForwardIosIcon } from '@/assets/svg'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  amount: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    '&>div': {
      width: '50%',
    },
    '&>img': {
      marginTop: '40px',
    },
  },
  icon: {
    margin: '0 10px',
  },
  button: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>div': {
      width: 'calc(50% - 15px)',
      display: 'flex',
      flexDirection: 'column',
      '&>button': {
        '&:first-child': {
          marginBottom: '15px',
        },
      },
      //PC
      '@media screen and (min-width:960px)': {
        '&:first-child': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          '&>button': {
            width: 'calc(50% - 10px)',
            marginBottom: '0 !important',
          },
        },
        '&:last-child': {
          '&>button': {
            width: '100%',
            marginBottom: '0 !important',
          },
        },
      },
    },
  },
}))

export default function Repay(props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { LiteContext, registry },
  } = useContext(Context)
  const {
    liteState: { lite, forceUpdate },
    setLiteState,
  } = useContext(LiteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      want: ethers.constants.Zero,
      coll: ethers.constants.Zero,
    },
    output: {
      clpt: ethers.constants.Zero,
    },
    I: { want: '', coll: '' },
  })
  const [update, setUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.want.eq(0) && state.input.coll.eq(0):
        ctx.action.deposit = 'input to deposit'
        break
      case state.input.want.lt(0):
        ctx.item.iwant = true
        ctx.action.deposit = 'negative number'
        break
      case state.input.want.gt(lite.state.balance.want):
        ctx.item.iwant = true
        ctx.action.deposit = 'insufficient balance'
        break
      case state.input.want.gt(lite.state.allowance.want):
        ctx.item.iwant = true
        ctx.action.deposit = 'approve first'
        break
      case state.input.coll.lt(0):
        ctx.item.icoll = true
        ctx.action.deposit = 'negative number'
        break
      case state.input.coll.gt(lite.state.balance.coll):
        ctx.item.icoll = true
        ctx.action.deposit = 'insufficient balance'
        break
      case state.output.clpt.eq(0):
        ctx.item.oclpt = true
        ctx.action.deposit = 'unknown error'
        break
      case state.output.clpt.lt(0):
        ctx.item.oclpt = true
        ctx.action.deposit = 'negative number'
        break
      default:
        break
    }
    return ctx
  })()
  useEffect(() => {
    ;(async () => {
      const changed = await lite.fetch_state()
      try {
        const want = lite.transform('want', 'str', state.I.want)
        if (want.eq(state.input.want) === false) {
          setState({ input: { ...state.input, want: want } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.input.want) === false) {
          setState({ input: { ...state.input, want: ethers.constants.Zero } })
          return
        }
      }
      try {
        const coll = lite.transform('std', 'str', state.I.coll)
        if (coll.eq(state.input.coll) === false) {
          setState({ input: { ...state.input, coll: coll } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.input.coll) === false) {
          setState({ input: { ...state.input, coll: ethers.constants.Zero } })
          return
        }
      }
      try {
        const clpt = await lite.controller().get_dk(state.input.coll, lite.transform('std', 'want', state.input.want))
        if (clpt.eq(state.output.clpt) === false) {
          setState({ output: { ...state.output, clpt: clpt } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.output.clpt) === false) {
          setState({ output: { ...state.output, clpt: ethers.constants.Zero } })
          return
        }
      }
      if (changed) {
        setUpdate({})
      }
    })()
  }, [state, lite, forceUpdate])
  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="want"
              state={{ state, setState, lite }}
              click={{
                condition: () => lite.state.allowance.want.gt('100000000000000000000000000000000'),
                max: () => {
                  setState({ I: { ...state.I, want: lite.transform('str', 'want', null) } })
                },
              }}
              style={{ height: '90px' }}
            />
            <AmountInput
              title="coll"
              state={{ state, setState, lite }}
              click={{
                condition: () => lite.state.balance.coll.gt('0'),
                max: () => {
                  setState({ I: { ...state.I, coll: lite.transform('str', 'balance', 'coll') } })
                },
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="clpt" state={{ state, lite }} style={{ height: '249px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={`todo`}
          info={[
            {
              'Pool Shares': `${(
                (ethers.utils.formatEther(lite.state.balance.clpt) / ethers.utils.formatEther(lite.state.swap.sk)) *
                100
              ).toPrecision(3)} %`,
            },
            {
              'Pool State': `1 WANT = ${(
                ethers.utils.formatEther(lite.state.swap.sx) / ethers.utils.formatEther(lite.state.swap.sy)
              ).toPrecision(3)} COLL`,
            },
            {
              Slipage: lite.state.swap.sk.eq(0)
                ? 'NaN'
                : `${(
                    (((parseFloat(
                      ethers.utils.formatEther(
                        lite.state.swap.sx
                          .add(lite.state.swap.sk)
                          .mul(ethers.utils.parseEther('1'))
                          .div(
                            lite.state.swap.sy.add(
                              lite.state.swap.sk.mul(lite.pool().swap_sqp).div(ethers.BigNumber.from(1e9)),
                            ),
                          )
                          .sub(ethers.utils.parseEther('1')),
                      ),
                    ) -
                      parseFloat(
                        ethers.utils.formatEther(
                          lite.state.swap.sx
                            .add(lite.state.swap.sk)
                            .mul(ethers.utils.parseEther('1'))
                            .div(
                              lite.state.swap.sy.add(
                                lite.state.swap.sk.mul(lite.pool().swap_sqp).div(ethers.BigNumber.from(1e9)),
                              ),
                            )
                            .sub(ethers.utils.parseEther('1')),
                        ),
                      )) *
                      31556926000) /
                      (lite.expiry_time() - new Date())) *
                    100
                  ).toPrecision(3)} %`,
            },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Approve"
              onClick={async () => {
                await lite.approve('want')
                setLiteState({ forceUpdate: {} })
              }}
            />
            <MyButton
              name="Deposit"
              onClick={async () => {
                await lite.deposit(state.input.want, state.input.coll, state.output.clpt)
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
          <div>
            <MyButton
              name="Claim"
              onClick={async () => {
                await lite.claim()
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
        </div>
      </div>
    ),
    [lite, state, update],
  )
}
