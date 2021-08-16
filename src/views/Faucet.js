import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button, InputAdornment } from '@material-ui/core'
import { useState, useContext } from 'react'
import { Context } from '@/store'
import DynamicFont from 'react-dynamic-font'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles({
  root: {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    margin: '10px',
    fontFamily: 'Gillsans',
    '&>div': {
      margin: '10px',
    },
  },
  input: {
    backgroundColor: 'white',
    marginTop: '30px !important',
    width: '600px',
    '@media screen and (max-width:960px)': {
      width: '80vw',
    },
  },
})
export default function Faucet() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { registry, signer },
    setState,
  } = useContext(Context)
  const [amount, setAmount] = useState('')
  const handleChange = (e) => {
    setAmount(e.target.value)
  }
  const sendMe = async (token) => {
    if (!signer) {
      enqueueSnackbar({
        type: 'failed',
        title: 'Fail.',
        message: 'No Account.',
      })
      return
    }
    const addr = {
      usdt: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
      usdc: '0x67C9a0830d922C80A96408EEdF606c528836880C',
    }
    signer
      .sendTransaction({ to: addr[token], value: ethers.utils.parseEther(String(amount || 0)) })
      .then((resp) => resp.wait())
      .then(({ status }) => {
        if (status === 1)
          enqueueSnackbar({
            type: 'success',
            title: 'Faucet.',
            message: 'You have successfully get test token.',
          })
        else
          enqueueSnackbar({
            type: 'failed',
            title: 'Fail.',
            message: 'The execution failed due to an exception.',
          })
      })
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: 'User denied transaction signature.',
            })
            break
          default:
            console.log(code)
            break
        }
      })
  }
  return (
    <div className={classes.root}>
      <div style={{ fontSize: '40px' }}>Collar Faucet</div>
      <div style={{ fontSize: '20px', maxWidth: 'calc(80vw)' }}>
        <DynamicFont content="Claim your test token for Collar open alpha product" />
      </div>
      <TextField
        className={classes.input}
        label={
          amount === ''
            ? 'The amount of ETH you need to exchange for testcoin'
            : `You will get ${(133337 * amount || 0) + 13.37} testcoin`
        }
        type="number"
        variant="filled"
        value={amount}
        onChange={handleChange}
      />
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ width: '200px', maxWidth: '40%', margin: '10px' }}
          onClick={() => sendMe('usdt')}
        >
          Send me USDT
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ width: '200px', maxWidth: '40%', margin: '10px' }}
          onClick={() => sendMe('usdc')}
        >
          Send me USDC
        </Button>
      </div>
    </div>
  )
}
