import { ethers } from 'ethers'
import collar from '../config/abi/collar'

const getContract = (address, signer) => {
  return new ethers.Contract(address, collar, signer)
}

export default getContract
