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

export default function Borrow() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { LiteContext, registry, signer },
  } = useContext(Context)
  const {
    liteState: { lite, forceUpdate },
    setLiteState,
  } = useContext(LiteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      bond: ethers.constants.Zero,
    },
    output: {
      want: ethers.constants.Zero,
    },
    I: { bond: '' },
  })
  const [update, setUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.bond.eq(0):
        ctx.action.borrow = 'input to borrow'
        break
      case state.input.bond.lt(0):
        ctx.item.ibond = true
        ctx.action.borrow = 'negative number'
        break
      case state.input.bond.gt(lite.state.balance.bond):
        ctx.item.ibond = true
        ctx.action.borrow = 'insufficient balance'
        break
      case state.input.bond.gt(lite.state.allowance.bond):
        ctx.item.ibond = true
        ctx.action.borrow = 'approve first'
        break
      case state.output.want.eq(0):
        ctx.item.owant = true
        ctx.action.borrow = 'insufficient liquidity'
        break
      case state.output.want.lt(0):
        ctx.item.owant = true
        ctx.action.borrow = 'negative number'
        break
      case lite.expiry_time() <= new Date():
        ctx.action.borrow = 'expired'
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
        const bond = lite.transform('bond', 'str', state.I.bond)
        if (bond.eq(state.input.bond) === false) {
          setState({ input: { ...state.input, bond: bond } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.input.bond) === false) {
          setState({ input: { ...state.input, bond: ethers.constants.Zero } })
          return
        }
      }
      try {
        const want = lite.transform(
          'want',
          'std',
          await lite.controller().get_dy(lite.transform('std', 'bond', state.input.bond)),
        )
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
              title="bond"
              state={{ state, setState, lite }}
              click={{
                condition: () => lite.state.allowance.bond.gt('100000000000000000000000000000000'),
                max: () => {
                  setState({ I: { bond: lite.transform('str', 'bond', null) } })
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
              Slippage: lite.state.swap.sk.eq(0)
                ? 'NaN'
                : `${(
                    (((parseFloat(
                      ethers.utils.formatEther(
                        lite.state.swap.sx
                          .add(state.input.bond)
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
            { 'Minimal Recieve': `${(ethers.utils.formatEther(state.output.want) * 0.995).toFixed(3)} USDC` },
            { Rounte: 'USDT -> COLL -> USDC' },
            {
              Fee: `${
                lite.state.swap.sk.eq(0)
                  ? '0'
                  : (
                      ethers.utils.formatEther(state.output.want) *
                      (1 - ethers.utils.formatEther(lite.state.swap.fee))
                    ).toFixed(4)
              } WANT`,
            },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Approve"
              onClick={async () => {
                await lite.approve('bond')
                setLiteState({ forceUpdate: {} })
              }}
            />
            <MyButton
              name="Deposit & Borrow"
              onClick={async () => {
                await lite.borrow(state.input.bond, state.output.want)
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
