import { ethers } from 'ethers'
import { useContext, useRef } from 'react'
import { Context } from '@/store'

import { createRef } from 'react'
import { ReactTerminal } from 'react-terminal'
import { TerminalContextProvider } from 'react-terminal'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'

const ABI = {
  ERC20: [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function transfer(address to, uint amount) returns (boolean)',
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ],
}

export default function Term() {
  const {
    state: { signer, registry },
    setState,
  } = useContext(Context)

  const REF = useRef()
  const cmds = {}
  cmds['get-help'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>print help messages.</p>
          <p>usage:</p>
          <p>
            <b>get-help</b> --- show collar console help{' '}
          </p>
          <p>
            <b>get-help %CMD% </b> --- show help infomation of CMD
          </p>
        </Box>
      )
    }
    if (msg === '') {
      return (
        <Box>
          <p>collar console provides a terminal for users to use collar protocol.</p>
          <p>
            type <b>list-commands</b> to see all available commands
          </p>
          <p>
            type <b>get-help %CMD%</b> to see the help infomation of CMD
          </p>
        </Box>
      )
    }
    return cmds[msg](null)
  }
  cmds['alert-message'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>show an alert message.</p>
          <p>usage:</p>
          <p>
            <b>alert-message %MSG% </b> --- alert MSG
          </p>
        </Box>
      )
    }
    alert(msg)
  }
  cmds['list-commands'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>list all commands.</p>
          <p>usage:</p>
          <p>
            <b>list-commands</b> --- list all commands
          </p>
        </Box>
      )
    }
    return (
      <Box>
        {Object.keys(this.cmds).map((k) => (
          <li key={k}>{k}</li>
        ))}
      </Box>
    )
  }
  cmds['hello-collar'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>show welcome message.</p>
          <p>usage:</p>
          <p>
            <b>hellow-collar</b> --- show welcome message
          </p>
        </Box>
      )
    }
    return (
      <Box>
        <p>e aí beleza</p>
      </Box>
    )
  }
  cmds['get-address'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>show current account address connected.</p>
          <p>usage:</p>
          <p>
            <b>get-address</b> --- show current account address connected
          </p>
        </Box>
      )
    }
    if (signer === null) {
      return (
        <Box>
          <p>connect wallet first please.</p>
        </Box>
      )
    }
    const address = await signer.getAddress()
    return (
      <Box>
        <p>{address}</p>
      </Box>
    )
  }
  cmds['get-balance'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>show current account balance connected.</p>
          <p>usage:</p>
          <p>
            <b>get-balance</b> --- show current account ETH balance
          </p>
        </Box>
      )
    }
    if (signer === null) {
      return (
        <Box>
          <p>connect wallet first please.</p>
        </Box>
      )
    }
    const balance = await signer.getBalance()
    return (
      <Box>
        <p>{`${ethers.utils.formatEther(balance)} ether`}</p>
      </Box>
    )
  }
  cmds['transfer-erc20'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>transfer erc20 token.</p>
          <p>usage:</p>
          <p>
            <b>transfer-erc20 %TOKEN% %RECEIVER% %AMOUNT% %DECIMALS%</b> --- transfer erc20 token (default: DECIMALS =
            18)
          </p>
        </Box>
      )
    }
    if (signer === null) {
      return (
        <Box>
          <p>connect wallet first please.</p>
        </Box>
      )
    }
    let [token, receiver, amount, decimals] = msg.split(' ')
    decimals = decimals || 18
    const erc20 = new ethers.Contract(token, ABI.ERC20)
    const tx = await erc20.connect(signer).transfer(receiver, ethers.utils.parseUnits(amount, decimals))
    return (
      <Box>
        <p>{tx.hash}</p>
      </Box>
    )
  }
  cmds['get-erc20-balance'] = async (msg) => {
    if (msg === null) {
      return (
        <Box>
          <p>get erc20 balance of an account.</p>
          <p>usage:</p>
          <p>
            <b>get-erc20-balance %TOKEN% %ADDRESS% </b> --- get erc20 balance (default: ADDRESS = current address)
          </p>
        </Box>
      )
    }
    if (signer === null) {
      return (
        <Box>
          <p>connect wallet first please.</p>
        </Box>
      )
    }
    let [token, address] = msg.split(' ')
    address = address || (await signer.getAddress())
    const erc20 = new ethers.Contract(token, ABI.ERC20)
    const value = await erc20.connect(signer).balanceOf(address)
    const decimals = await erc20.connect(signer).decimals()
    return (
      <Box>
        <p>{ethers.utils.formatUnits(value, decimals)}</p>
      </Box>
    )
  }

  const paste_command = async () => {
    const e = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(e, 'target', { value: REF.current.firstChild, enumerable: true })
    document.dispatchEvent(e)
    const cmd = await navigator.clipboard.readText()
    for (const i in cmd) {
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: cmd[i],
        char: cmd[i],
        shiftKey: true,
      })
      document.dispatchEvent(e)
    }
  }

  const welcome = (
    <Typography component="code">
      <Box fontFamily="Monospace" align="center" fontSize="h6.fontSize" m={1}>
        Collar Console
      </Box>
      <Box fontFamily="Monospace" align="center" fontSize="h6.fontSize" m={1}>
        USE AT YOUR OWN RISK
      </Box>
      <Box fontFamily="Monospace" align="center" fontSize="h6.fontSize" m={1}>
        <span sytle={{ whiteSpace: 'nowrap' }}>type `get-help` to get started :)</span>
      </Box>
    </Typography>
  )
  const commands = {}
  for (const k in cmds) {
    commands[k] = async (msg) => {
      try {
        return await cmds[k](msg)
      } catch (err) {
        return (
          <Box>
            <p>unexpected error</p>
            <p>{`${err}`}</p>
          </Box>
        )
      }
    }
  }

  return (
    <TerminalContextProvider>
      <Box ref={REF} height="100%" width="100%" position="fixed" pb={8}>
        <ReactTerminal theme="dracula" commands={commands} showControlButtons={false} welcomeMessage={welcome} />
        <Box position="absolute" right={'5%'} bottom={128}>
          <Fab color="secondary" variant="extended" onClick={paste_command}>
            Paste
          </Fab>
        </Box>
      </Box>
    </TerminalContextProvider>
  )
}
