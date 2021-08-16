import { ethers } from 'ethers'
import collar from '@/config/abi/collar'
export default class registry {
  constructor(registry, pool, signer, txcb, enqueueSnackbar) {
    this.f = { registry: registry, pool: pool, signer: signer }
    this.callback = txcb
    this.enqueueSnackbar = enqueueSnackbar
    this.state = {
      balance: {
        bond: ethers.constants.Zero,
        want: ethers.constants.Zero,
        call: ethers.constants.Zero,
        coll: ethers.constants.Zero,
        clpt: ethers.constants.Zero,
        collar: ethers.constants.Zero,
      },
      allowance: {
        bond: ethers.constants.Zero,
        want: ethers.constants.Zero,
      },
      earned: {
        collar: ethers.constants.Zero,
      },
      swap: {
        sx: ethers.constants.Zero,
        sy: ethers.constants.Zero,
        sk: ethers.constants.Zero,
      },
    }
  }

  async fetch_state() {
    const pool = this.f.pool()
    const signer = this.f.signer()
    const snapshot = JSON.stringify(this.state)
    if (signer === null) {
      return false
    }
    const me = await signer.getAddress()
    const bond = this.transform('erc20', null, 'bond')
    const want = this.transform('erc20', null, 'want')
    const call = this.transform('erc20', null, 'call')
    const coll = this.transform('erc20', null, 'coll')
    const clpt = this.transform('erc20', null, 'clpt')
    const collar = this.transform('erc20', null, 'collar')
    ;[
      this.state.balance.bond,
      this.state.balance.want,
      this.state.balance.call,
      this.state.balance.coll,
      this.state.balance.clpt,
      this.state.balance.collar,
      this.state.allowance.bond,
      this.state.allowance.want,
      this.state.earned.collar,
      this.state.swap.sx,
      this.state.swap.sy,
      this.state.swap.sk,
      this.state.swap.fee,
    ] = await Promise.all([
      bond.balanceOf(me),
      want.balanceOf(me),
      call.balanceOf(me),
      coll.balanceOf(me),
      clpt.balanceOf(me),
      collar.balanceOf(me),
      bond.allowance(me, pool),
      want.allowance(me, pool),
      this.controller().earned(me),
      this.controller().sx(),
      this.controller().sy(),
      this.controller().sk(),
      this.controller().swap_fee(),
    ])
    if (JSON.stringify(this.state) === snapshot) {
      return false
    }
    return true
  }

  controller(address) {
    const pool = address || this.f.pool()
    const signer = this.f.signer()
    return new ethers.Contract(pool, collar, signer)
  }

  transform(to, from, value) {
    const registry = this.f.registry()
    const pool = this.f.pool()
    const signer = this.f.signer()
    switch (to) {
      case 'address':
        switch (from) {
          default:
            switch (value) {
              case 'bond':
                return registry.pool[pool].addr_bond
              case 'want':
                return registry.pool[pool].addr_want
              case 'call':
                return registry.pool[pool].addr_call
              case 'coll':
                return registry.pool[pool].addr_coll
              case 'collar':
                return registry.pool[pool].addr_collar
              case 'clpt':
                return pool
              default:
                return pool
            }
        }
      case 'token':
        switch (from) {
          default:
            switch (value) {
              default:
                return registry.token[this.transform('address', null, value)]
            }
        }
      case 'erc20':
        switch (from) {
          default:
            switch (value) {
              default:
                return new ethers.Contract(
                  this.transform('address', from, value),
                  [
                    'function transfer(address, uint256) external',
                    'function approve(address, uint256) external',
                    'function balanceOf(address) external view returns (uint256)',
                    'function allowance(address, address) external view returns (uint256)',
                  ],
                  signer,
                )
            }
        }
      case 'balance':
        switch (from) {
          default:
            // name
            switch (value) {
              case 'call':
                return this.state.balance.call
              case 'coll':
                return this.state.balance.coll
              case 'collar':
                return this.state.balance.collar
              case 'clpt':
                return this.state.balance.clpt
              default:
                throw new Error('TODO')
            }
        }
      case 'std':
        switch (from) {
          case 'bond':
            switch (value) {
              case undefined:
                return this.state.balance.bond
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
              case null:
                return this.state.balance.bond
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
              case 'balance':
                return this.state.balance.bond
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
              case 'allowance':
                return this.state.allowance.bond
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
              default:
                return value
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
            }
          case 'want':
            switch (value) {
              case undefined:
                return this.state.balance.want
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
              case null:
                return this.state.balance.want
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
              case 'balance':
                return this.state.balance.want
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
              case 'allowance':
                return this.state.allowance.want
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
              default:
                return value
                  .mul('1000000000000000000')
                  .div(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
            }
          case 'str':
            switch (value) {
              default:
                return ethers.utils.parseUnits(value, 18)
            }
          case 'balance':
            switch (value) {
              case 'bond':
                return this.transform('std', 'bond')
              case 'want':
                return this.transform('std', 'want')
              default:
                return this.transform('balance', 'name', value)
            }
          default:
            switch (value) {
              default:
                return value
            }
        }
      case 'bond':
        switch (from) {
          case 'str':
            switch (value) {
              default:
                return ethers.utils.parseUnits(value, this.transform('token', null, 'bond').decimals)
            }
          default:
            switch (value) {
              default:
                return value
                  .mul(ethers.BigNumber.from('10').pow(this.transform('token', null, 'bond').decimals))
                  .div('1000000000000000000')
            }
        }
      case 'want':
        switch (from) {
          case 'str':
            switch (value) {
              default:
                return ethers.utils.parseUnits(value, this.transform('token', null, 'want').decimals)
            }
          default:
            switch (value) {
              default:
                return value
                  .mul(ethers.BigNumber.from('10').pow(this.transform('token', null, 'want').decimals))
                  .div('1000000000000000000')
            }
        }
      case 'str':
        switch (from) {
          default:
            switch (value) {
              default:
                return ethers.utils.formatEther(this.transform('std', from, value))
            }
        }
      case 'estr':
        switch (from) {
          default:
            switch (value) {
              default:
                return this.transform('str', from, value)
            }
        }

      default:
        break
    }
  }

  expiry_time() {
    const registry = this.f.registry()
    const pool = this.f.pool()
    return new Date(registry.pool[pool].expiry_time * 1000)
  }

  pool() {
    const registry = this.f.registry()
    const pool = this.f.pool()
    return registry.pool[pool]
  }

  async approve(coin) {
    switch (coin) {
      case 'bond':
      case 'want':
        coin = this.transform('address', null, coin)
        break
      default:
        break
    }
    const pool = this.f.pool()
    const signer = this.f.signer()
    const erc20 = new ethers.Contract(coin, ['function approve(address, uint256) external'], signer)
    await erc20
      .approve(pool, ethers.constants.MaxUint256)
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('approve', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }

  async borrow(bond, want) {
    await this.controller()
      .borrow_want(this.transform('std', 'bond', bond), this.with_loss(this.transform('std', 'want', want)))
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('borrow', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            this.notify('error')
            console.log(code)
            break
        }
      })
  }
  async repay(want, coll) {
    let resp
    switch (true) {
      case want.eq(ethers.constants.Zero):
        resp = this.controller().burn_dual(coll)
        break

      case coll.eq(ethers.constants.Zero):
        resp = this.controller().burn_call(this.transform('std', 'want', want))
        break

      default:
        resp = this.controller().repay_both(this.transform('std', 'want', want), coll)
        break
    }
    await resp
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('repay', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async deposit(want, coll, clpt) {
    await this.controller()
      .mint(coll, this.transform('std', 'want', want), this.with_loss(clpt))
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('deposit', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async withdraw(clpt) {
    await this.controller()
      .withdraw_both(clpt)
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('withdraw', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async claim() {
    await this.controller()
      .claim_reward()
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('claim', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async burn_and_claim(clpt) {
    await this.controller()
      .burn_and_claim(clpt)
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('withdraw', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async lend(want, coll) {
    await this.controller()
      .swap_want_to_min_coll(this.with_loss(coll), this.transform('std', 'want', want))
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('lend', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async redeem(want, coll) {
    await this.controller()
      .swap_coll_to_min_want(coll, this.with_loss(this.transform('std', 'want', want)))
      .then((resp) => resp.wait())
      .then(({ status }) => this.notify('redeem', status))
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }
  async mint(n) {
    await this.controller()
      .mint_dual(n)
      .then((resp) => resp.wait())
      .then(console.log)
      .catch(({ code }) => {
        switch (code) {
          case 4001:
            this.notify('cancel')
            break
          default:
            console.log(code)
            break
        }
      })
  }

  with_loss(x) {
    return x.mul(995).div(1000)
  }

  reset(registry, pool, signer) {
    registry && (this.f.registry = registry)
    pool && (this.f.pool = pool)
    signer && (this.f.signer = signer)
  }

  info(type) {
    switch (type) {
      case 'bond':
        return 'BOND token is the collateral asset deposited by borrower.'
      case 'want':
        return 'WANT token is the debt asset provided by lender.'
      case 'coll':
        return 'COLL token is the lending certificate.'
      case 'clpt':
        return 'CLPT is the Collar LP Token for the current pair.'
      case 'Borrow':
        return `Borrow for a fixed rate with no collateral liquidation risk. 
		Collateral is safely stored and can be withdrawn at any time before the current round ends. 
		A fixed 0.01% fee is charged for each borrow order.`
      case 'Repay':
        return `Repay your loan at any time before the current round ends to withdraw your collateral. 
		WANT tokens and COLL tokens are both acceptable for repayment. 
		Borrowers reduce the cost of their loan by using the lower priced token for repayment.`
      case 'Deposit':
        return `There are three ways to provide liquidity in Collar: provide only WANT, only COLL, or both WANT and COLL. 
		The APY earned by a provider is fixed as long as they don't redeem their CLPT before the current round ends.`
      case 'Withdraw':
        return `Liquidity providers can withdraw their liquidity at any time before the current round ends. 
		Redeem CLPT to collect the corresponding underlying assets, which are possibly not in the same proportion as the original deposit.`
      case 'Lend':
        return `Earn a fixed interest rate over a fixed term. 
		A nominal 0.01% fee is charged for each lending order.`
      case 'Exit':
        return `Lenders can exit at any time before the current round ends. 
		The interest earned may differ from the originally quoted APY.`
      default:
        return ''
    }
  }

  notify(method, status) {
    this.enqueueSnackbar(this.fbInfo(method, status))
  }

  fbInfo(method, status) {
    const failed = {
      type: 'failed',
      title: 'Fail.',
      message: 'Your transaction failed.',
    }
    switch (method) {
      case 'approve':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Approved!',
              message: 'You have successfully approved your asset.',
            }
          default:
            return failed
        }
      case 'borrow':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Deposited and Borrowed.',
              message: 'You have successfully borrowed asset.',
            }
          default:
            return failed
        }
      case 'repay':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Repaid.',
              message: 'You have successfully repaid your loan.',
            }
          default:
            return failed
        }
      case 'deposit':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Deposited.',
              message: 'You have successfully deposited your asset.',
            }
          default:
            return failed
        }
      case 'withdraw':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Withdrawn.',
              message: 'You have successfully withdraw your liquidity.',
            }
          default:
            return failed
        }
      case 'claim':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Claimed.',
              message: 'You have successfully claimed your reward.',
            }
          default:
            return failed
        }
      case 'lend':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Lent.',
              message: 'You have successfully lent your assset.',
            }
          default:
            return failed
        }
      case 'redeem':
        switch (status) {
          case 1:
            return {
              type: 'success',
              title: 'Redeemed.',
              message: 'You have successfully redeem your loan.',
            }
          default:
            return failed
        }
      case 'cancel':
        return {
          type: 'failed',
          title: 'Fail.',
          message: 'User denied transaction signature.',
        }
      default:
        return {
          type: 'failed',
          title: 'Fail.',
          message: 'The execution failed due to an exception.',
        }
    }
  }
}
