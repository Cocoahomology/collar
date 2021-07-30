import { Component } from 'react'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import { ethers } from 'ethers'

export default class AccountDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: null,
      balance: null,
    }
  }

  sync_address = async () => {
    if (this.props.signer) {
      const address = await this.props.signer.getAddress()
      if (address !== this.state.address) {
        this.setState({ address: address })
        return
      }
    }
  }

  sync_balance = async () => {
    if (this.props.signer) {
      const balance = await this.props.signer.getBalance()
      if (this.state.balance === null) {
        this.setState({ balance: balance })
        return
      }
      if (balance.eq(this.state.balance) === false) {
        this.setState({ balance: balance })
        return
      }
    }
  }

  render_address = () => {
    if (this.state.address) {
      return (
        <Box
          fontFamily="Monospace"
          textOverflow="ellipsis"
          overflow="hidden"
          m={1}
          fontSize="h6.fontSize"
          align="center"
        >
          {this.state.address}
        </Box>
      )
    }
    return (
      <Box width="100%">
        <LinearProgress color="secondary" />
      </Box>
    )
  }

  render() {
    this.sync_address()
    this.sync_balance()
    return (
      <Dialog fullWidth open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>Account</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              {this.render_address()}
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow key="address">
                      <TableCell component="th" scope="row">
                        ETH Balance
                      </TableCell>
                      <TableCell align="right">
                        {this.state.balance ? (
                          <Typography color="textPrimary" align="center" component="code">
                            {ethers.utils.formatEther(this.state.balance)}
                          </Typography>
                        ) : (
                          <Box width="100%">
                            <LinearProgress color="secondary" />
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(this.state.address)
                }}
              >
                <Typography noWrap>copy address</Typography>
              </Button>
              <Button color="primary" href={`https://etherscan.io/address/${this.state.address}`} target="_blank">
                <Typography noWrap>view on etherscan</Typography>
              </Button>
              <Button color="primary" onClick={this.props.disconnect} target="_blank">
                <Typography noWrap>disconnect</Typography>
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }
}
