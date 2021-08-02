import { useCallback, useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { Context } from '@/store'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import { MyButton, AmountInputDouble, AmountShow, ApyFloatMessage } from '@/components/modules'
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
      bond: ethers.constants.Zero,
    },
    I: { want: '', coll: '' },
    old: { want: '', coll: '' },
  })
  const [update, setUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.want.eq(0) && state.input.coll.eq(0):
        ctx.action.repay = 'input to repay'
        break
      case state.input.want.lt(0):
        ctx.item.iwant = true
        ctx.action.repay = 'negative number'
        break
      case state.input.coll.lt(0):
        ctx.item.icoll = true
        ctx.action.repay = 'negative number'
        break
      case state.input.want.gt(lite.state.balance.want):
        ctx.item.iwant = true
        ctx.action.repay = 'insufficient balance'
        break
      case state.input.coll.gt(lite.state.balance.coll):
        ctx.item.icoll = true
        ctx.action.repay = 'insufficient balance'
        break
      case state.input.want.gt(lite.state.allowance.want):
        ctx.item.iwant = true
        ctx.action.repay = 'approve first'
        break
      case state.output.bond.eq(0):
        ctx.item.obond = true
        ctx.action.repay = 'unknow error'
        break
      case state.output.bond.lt(0):
        ctx.item.obond = true
        ctx.action.repay = 'negative number'
        break
      case lite.transform('std', 'want', state.input.want).add(state.input.coll).gt(lite.state.balance.call):
        ctx.item.iwant = true
        ctx.item.icoll = true
        ctx.action.repay = 'insufficient call'
        break
      case lite.expiry_time() <= new Date():
        ctx.action.repay = 'expired'
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
        const bond = lite.transform('bond', 'std', state.input.want.add(state.input.coll))
        if (bond.eq(state.output.bond) === false) {
          setState({ output: { ...state.output, bond: bond } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.output.bond) === false) {
          setState({ output: { ...state.output, bond: ethers.constants.Zero } })
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
            <AmountInputDouble
              title={['want', 'coll']}
              state={{ state, setState, lite }}
              click={[
                {
                  condition: () => lite.state.allowance.want.gt('100000000000000000000000000000000'),
                  max: () => {
                    setState({
                      I: {
                        ...state.I,
                        want: `${Math.min(
                          lite.transform('str', 'want', lite.state.balance.call),
                          lite.transform('str', 'want', null),
                        )}`,
                      },
                    })
                  },
                },
                {
                  condition: () => lite.state.balance.coll.gt('0'),
                  max: () => {
                    setState({
                      I: {
                        ...state.I,
                        coll: `${Math.min(
                          lite.transform('str', 'std', lite.state.balance.call),
                          lite.transform('str', 'std', lite.state.balance.coll),
                        )}`,
                      },
                    })
                  },
                },
              ]}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="bond" state={{ state, lite }} style={{ height: '90px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ margin: '-8px 0 8px 0', fontFamily: 'Helvetica', fontSize: '0.8em' }}>Maximal debt = XXX</div>
          <ApyFloatMessage
            APY={1.4}
            info={[
              { Slippage: ' 1.4%' },
              { 'Minimal Recieve': '1.4USDC' },
              { Rounte: 'COLL-> USDT / WANT->USDT' },
              { Fee: 'xxx WANT ' },
            ]}
          />
        </div>
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
              name="Repay"
              onClick={async () => {
                await lite.repay(state.input.want, state.input.coll)
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
