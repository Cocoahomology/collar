import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { Context } from '@/store'
import { ethers } from 'ethers'
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
    flexDirection: 'column',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>button': {
        width: 'calc(50% - 15px)',
      },
    },
  },
}))

export default function Exit(props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { LiteContext, registry },
  } = useContext(Context)
  const {
    liteState: { lite, forceUpdate, want },
    setLiteState,
  } = useContext(LiteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      coll: ethers.constants.Zero,
    },
    output: {
      want: ethers.constants.Zero,
    },
    I: { coll: '' },
  })
  const [update, setUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.coll.eq(0):
        ctx.action.redeem = 'input to redeem'
        break
      case state.input.coll.lt(0):
        ctx.item.icoll = true
        ctx.action.redeem = 'negative number'
        break
      case state.input.coll.gt(lite.state.balance.coll):
        ctx.item.icoll = true
        ctx.action.redeem = 'insufficient balance'
        break
      case state.output.want.eq(0):
        ctx.item.owant = true
        ctx.action.redeem = 'insufficient liquidity'
        break
      case state.output.want.lt(0):
        ctx.item.owant = true
        ctx.action.redeem = 'negative number'
        break
      default:
        break
    }
    switch (true) {
      case lite.state.earned.collar.eq(0):
        ctx.action.claim = 'nothing claim'
        break
      default:
        break
    }
    return ctx
  })()
  useEffect(() => {
    ;(async () => {
      await lite.fetch_state()
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
        const want = lite.transform('want', 'std', await lite.controller().get_dy(state.input.coll))
        if (want.eq(state.output.want) === false) {
          setState({ output: { ...state.output, want: want } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.output.want) === false) {
          setState({ output: { ...state.output, want: ethers.constants.Zero } })
          return
        }
      }
      setUpdate({})
    })()
  }, [state, lite, forceUpdate])
  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="coll"
              state={{ state, setState, lite }}
              click={{
                condition: () => lite.state.balance.coll.gt('0'),
                max: () => {
                  setState({ I: { coll: lite.transform('str', 'balance', 'coll') } })
                },
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="want" state={{ state, lite }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={
            lite.state.swap.sk.eq(0)
              ? 'NaN'
              : (
                  ((parseFloat(
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
                  ) *
                    31556926000) /
                    (lite.expiry_time() - new Date())) *
                  100
                ).toPrecision(3)
          }
          info={[
            {
              'Slippage tolerance': lite.state.swap.sk.eq(0)
                ? 'NaN'
                : `${(
                    (((parseFloat(
                      ethers.utils.formatEther(
                        lite.state.swap.sx
                          .add(lite.state.swap.sk)
                          .mul(ethers.utils.parseEther('1'))
                          .div(
                            lite.state.swap.sy
                              .add(state.output.want)
                              .add(lite.state.swap.sk.mul(lite.pool().swap_sqp).div(ethers.BigNumber.from(1e9))),
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
            {
              'Minimum recieved': `${(ethers.utils.formatEther(state.output.want) * 0.995).toFixed(3)} ${
                registry.token[want].symbol
              }`,
            },
            { Route: `COLL -> ${registry.token[want].symbol}` },
            {
              'Nominal swap fee': `${(ethers.utils.formatEther(state.output.want) * 0.995).toFixed(3)} ${
                registry.token[want].symbol
              } `,
            },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => {
                console.log('Approve')
              }}
            />
            <MyButton
              name="Exit"
              onClick={async () => {
                await lite.redeem(state.output.want, state.input.coll)
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
