import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { Context } from '@/store'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/modules'
import { makeStyles } from '@material-ui/core/styles'
import { iconInfo, iconUsdt, iconUsdc, ArrowForwardIosIcon } from '@/assets/svg'
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

export default function Withdraw(props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { LiteContext, registry },
  } = useContext(Context)
  const {
    liteState: { lite, bondId, wantId, bondList, wantList },
    setLiteState,
  } = useContext(LiteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      clpt: ethers.constants.Zero,
    },
    output: {
      want: ethers.constants.Zero,
      coll: ethers.constants.Zero,
    },
    I: { clpt: '' },
  })
  const [forceUpdate, setForceUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.clpt.eq(0):
        ctx.action.withdraw = 'input to withdraw'
        break
      case state.input.clpt.lt(0):
        ctx.item.iclpt = true
        ctx.action.withdraw = 'negative number'
        break
      case state.input.clpt.gt(lite.state.balance.clpt):
        ctx.item.iclpt = true
        ctx.action.withdraw = 'insufficient balance'
        break
      case state.output.want.eq(0) && state.output.coll.eq(0):
        ctx.item.owant = true
        ctx.action.withdraw = 'unknown error'
        break
      case state.output.want.lt(0):
        ctx.item.owant = true
        ctx.action.withdraw = 'negative number'
        break
      case state.output.coll.lt(0):
        ctx.item.ocoll = true
        ctx.action.withdraw = 'negative number'
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
      const changed = await lite.fetch_state()
      try {
        const clpt = lite.transform('std', 'str', state.I.clpt)
        if (clpt.eq(state.input.clpt) === false) {
          setState({ input: { ...state.input, clpt: clpt } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.input.clpt) === false) {
          setState({ input: { ...state.input, clpt: ethers.constants.Zero } })
          return
        }
      }
      try {
        const res = await lite.controller().get_dxdy(state.input.clpt)
        const coll = res[0]
        const want = lite.transform('want', 'std', res[1])
        if (want.eq(state.output.want) === false) {
          setState({ output: { ...state.output, want: want } })
          return
        }
        if (coll.eq(state.output.coll) === false) {
          setState({ output: { ...state.output, coll: coll } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.output.want) === false) {
          setState({ output: { ...state.output, want: ethers.constants.Zero } })
          return
        }
        if (ethers.constants.Zero.eq(state.output.coll) === false) {
          setState({ output: { ...state.output, coll: ethers.constants.Zero } })
          return
        }
      }
      if (changed) {
        setForceUpdate({})
      }
    })()
  }, [state, lite])
  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="clpt"
              state={{ state, setState, lite }}
              click={{
                condition: () => lite.state.balance.clpt.gt('0'),
                max: () => {
                  setState({ I: { clpt: lite.transform('str', 'balance', 'clpt') } })
                },
              }}
              style={{ height: '249px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="want" state={{ state, lite }} style={{ height: '90px' }} />
            <AmountShow title="coll" state={{ state, lite }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={1.4}
          info={[
            { 'Exchange rate': '1CLPT = 1 WANT + m COLL' },
            { 'Pool State': '1 COLL' },
            { 'Pool Shares': ' 0.113%' },
            { Fee: '2 COLL' },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Withdraw"
              onClick={async () => {
                await lite.withdraw(state.input.clpt)
                setLiteState({ forceUpdate: {} })
              }}
            />
            <MyButton
              name="Claim"
              onClick={async () => {
                await lite.claim()
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
          <div>
            <MyButton
              name="Withdraw & Claim"
              onClick={async () => {
                enqueueSnackbar({
                  type: 'failed',
                  title: 'Test',
                  message: 'Not support yet!',
                })
              }}
            />
          </div>
        </div>
      </div>
    ),
    [lite, state, forceUpdate],
  )
}
