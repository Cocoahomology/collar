import { useContext, useEffect, useState } from 'react'
import { Context } from '@/store'
import { makeStyles } from '@material-ui/core/styles'
import { ethers } from 'ethers'
import { InfoCard1, InfoCard2, InfoCard3 } from '@/components/modules'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '-10px',
    display: 'flex',
    background: 'none !important',
    flexDirection: 'column',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>div': {
        width: 'calc(50% - 10px)',
      },
    },
  },
}))

export default function Info() {
  const classes = useStyles()
  const {
    state: { registry, LiteContext },
  } = useContext(Context)
  const {
    liteState: { lite, forceUpdate },
    setLiteState,
  } = useContext(LiteContext)

  const [update, setUpdate] = useState({})

  useEffect(() => {
    ;(async () => {
      const changed = await lite.fetch_state()
      if (changed) {
        setUpdate({})
      }
    })()
  }, [lite, forceUpdate])

  return (
    <div className={classes.root}>
      <div>
        <InfoCard1
          token={lite.transform('token', '', 'bond').symbol}
          status={lite.state.allowance.bond.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
          amount={lite.transform('str', 'balance', 'bond')}
        />
        <InfoCard1
          token={lite.transform('token', '', 'want').symbol}
          status={lite.state.allowance.want.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
          amount={lite.transform('str', 'balance', 'want')}
        />
      </div>
      <div>
        <InfoCard1
          token={lite.transform('token', '', 'call').symbol}
          status="TOTAL BORROW"
          amount={lite.transform('str', 'balance', 'call')}
        />

        <InfoCard1
          token={lite.transform('token', '', 'coll').symbol}
          status="TOTAL LEND"
          amount={lite.transform('str', 'balance', 'coll')}
        />
      </div>
      <div>
        <InfoCard1
          token={lite.transform('token', '', 'clpt').symbol}
          status="LP TOKEN"
          amount={lite.transform('str', 'balance', 'clpt')}
        />

        <InfoCard1
          token={lite.transform('token', '', 'collar').symbol}
          status={`${parseFloat(lite.transform('str', 'std', lite.state.earned.collar)).toFixed(4)} EARNED`}
          amount={lite.transform('str', 'balance', 'collar')}
        />
      </div>
      <div>
        <InfoCard2
          title="Interest Rate"
          data={
            lite.state.swap.sk.eq(0)
              ? 'NaN'
              : ((parseFloat(
                  ethers.utils.formatEther(
                    lite.state.swap.sx
                      .add(lite.state.swap.sk)
                      .mul(ethers.utils.parseEther('1'))
                      .div(
                        lite.state.swap.sy.add(
                          lite.state.swap.sk.mul(lite.pool().swap_sqp).div(ethers.BigNumber.from(1e9)),
                        ),
                      )
                      .sub(ethers.utils.parseEther('1')),
                  ),
                ) *
                  31556926000) /
                  (lite.expiry_time() - new Date())) *
                100
          }
          info="FOR BOTH LENDING AND BORROWING"
        />
        <InfoCard2 title="FARM APY" data="---" info="---" />
      </div>
      <div>
        <InfoCard2
          title="Expiry"
          data={lite.expiry_time().toLocaleString()}
          info="REPAY BEFORE THIS TIME"
          styles={{ color: '#FF5C5C' }}
          noHr={true}
        />
        <InfoCard3
          title="Fee"
          data1="0.01% for BORROW, WITHDRAW, LEND and REDEEM"
          data2="0% for REPAY and DEPOSIT"
          noHr={true}
        />
      </div>
    </div>
  )
}
