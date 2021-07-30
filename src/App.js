import { useReducer, useEffect, createContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Context } from '@/store'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import { getWeb3NoAccount } from '@/utils/web3'

import { MyNotifyProvider } from '@/components/modules'
import Registry from './libraries/registry'
import Navigator from './components/Navigator'
import Header from './components/Header'

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.web3modal-modal-lightbox': {
      zIndex: '5',
    },
  },
}))

const web3 = new Web3(getWeb3NoAccount())
const registry = new Registry(window.location.hostname)
const web3Modal = new Web3Modal({
  network: registry.config.network,
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: registry.config.infuraid,
      },
    },
  },
})

export default function App() {
  const classes = useStyles()
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    menu_open: false,
    dialog_open: false,
    signer: null,
    web3,
    web3Modal,
    registry,
    LiteContext: createContext(),
  })

  const connect_wallet = async () => {
    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    if (network.chainId !== registry.config.chainid) {
      alert('not support this network, chainId: ' + network.chainId)
      setState({ signer: null })
      return
    }
    setState({
      signer: signer,
      web3: new Web3(provider),
    })
    if (!web3provider.on) {
      return
    }
    web3provider.on('disconnect', () => {
      web3Modal.clearCachedProvider()
      setState({ signer: null, dialog_open: false })
    })
    web3provider.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        web3Modal.clearCachedProvider()
        setState({ signer: null, dialog_open: false })
        return
      }
      await connect_wallet()
    })
    web3provider.on('chainChanged', async (chainId) => {
      if (chainId !== registry.config.chainid) {
        alert('not support this network, chainId: ' + chainId)
        setState({ signer: null })
      } else {
        await connect_wallet()
      }
    })
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect_wallet()
      return
    }
  }, [])

  return (
    <Context.Provider value={{ state, setState, connect_wallet }}>
      <MyNotifyProvider>
        <Header />
        <Navigator />
      </MyNotifyProvider>
    </Context.Provider>
  )
}
