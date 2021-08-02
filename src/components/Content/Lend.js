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

export default function Lend(props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { LiteContext, registry },
  } = useContext(Context)
  const {
    liteState: { lite, forceUpdate },
    setLiteState,
  } = useContext(LiteContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      want: ethers.constants.Zero,
    },
    output: {
      coll: ethers.constants.Zero,
    },
    I: { want: '' },
  })
  const [update, setUpdate] = useState({})
  const val = (() => {
    const ctx = { item: {}, action: {} }
    switch (true) {
      case state.input.want.eq(0):
        ctx.action.lend = 'input to lend'
        break
      case state.input.want.lt(0):
        ctx.item.iwant = true
        ctx.action.lend = 'negative number'
        break
      case state.input.want.gt(lite.state.balance.want):
        ctx.item.iwant = true
        ctx.action.lend = 'insufficient balance'
        break
      case state.input.want.gt(lite.state.allowance.want):
        ctx.item.iwant = true
        ctx.action.lend = 'approve first'
        break
      case state.output.coll.eq(0):
        ctx.item.ocoll = true
        ctx.action.lend = 'insufficient liquidity'
        break
      case state.output.coll.lt(0):
        ctx.item.ocoll = true
        ctx.action.lend = 'negative number'
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
        const coll = await lite.controller().get_dx(state.input.want)
        if (coll.eq(state.output.coll) === false) {
          setState({ output: { ...state.output, coll: coll } })
          return
        }
      } catch {
        if (ethers.constants.Zero.eq(state.output.coll) === false) {
          setState({ output: { ...state.output, coll: ethers.constants.Zero } })
          return
        }
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
                  setState({ I: { want: lite.transform('str', 'want', null) } })
                },
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="coll" state={{ state, lite }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={1.4}
          info={[
            { Slippage: ' 1.4%' },
            { 'Minimal Recieve': '1.4USDC' },
            { Rounte: 'USDT -> COLL' },
            { Fee: 'xxx WANT ' },
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
              name="Lend"
              onClick={async () => {
                await lite.lend(state.input.want, state.output.coll)
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
