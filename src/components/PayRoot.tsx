import * as React from 'react'
import { fetchPrice } from '../PriceApi'

declare var web3: any

export interface Props {
  title: string
  amount: number
  address: string
}

export default class PayRoot extends React.Component<Props, {}> {
  componentDidMount () {
    fetchPrice().then((price: any) => {
      this.setState({ price })
    })
  }

  submit () {
    const account = web3.eth.accounts[0]
    web3.eth.sendTransaction({
      from: account,
      to: this.props.address,
      value: web3.toWei(this.props.amount, 'ether')
    }, (err: Error, transactionHash: string) => {
      if (err) return console.error(err)

      console.log(transactionHash)
    })
  }

  render () {
    const props = this.props

    return (
      <div>
        <h1>{ props.title }</h1>

        <p>{ props.amount } eth</p>
        {/* <p>rate: { this.state.price && this.state.price.JPY } jpy / eth</p> */}
        <p>{ props.address }</p>
        <button onClick={ this.submit.bind(this) }>Send</button>
      </div>
    )
  }

}
