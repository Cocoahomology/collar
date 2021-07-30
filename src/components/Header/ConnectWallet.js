import { useState } from 'react'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'

export default function ConnectWallet(props) {
  const { signer, click_address, click_connect } = props
  const [address, setAddress] = useState(null)

  ;(async () => {
    if (signer) {
      const addr = await signer.getAddress()
      if (addr !== address) {
        setAddress(addr)
      }
    } else {
      if (address !== null) {
        setAddress(null)
      }
    }
  })()

  return address ? (
    <Button
      variant="outlined"
      color="inherit"
      onClick={click_address}
      style={{ borderRadius: '0', fontFamily: 'Avenir' }}
    >
      <Box textOverflow="ellipsis" fontFamily="Monospace" fontWeight="fontWeightBold" overflow="hidden" maxWidth="25vw">
        {address}
      </Box>
    </Button>
  ) : signer ? (
    <Box width="25vw">
      <LinearProgress color="secondary" />
    </Box>
  ) : (
    <Button
      variant="outlined"
      color="inherit"
      onClick={click_connect}
      style={{ borderRadius: '0', fontFamily: 'Avenir' }}
    >
      Connect Wallet
    </Button>
  )
}
