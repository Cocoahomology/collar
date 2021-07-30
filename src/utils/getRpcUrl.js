const getNodeUrl = () => {
  // local env to test
  if (process.env.NODE_ENV === 'development') {
    return 'https://kovan.infura.io'
  }

  // TODO: mainet rpc url
  return ''
}

export default getNodeUrl
