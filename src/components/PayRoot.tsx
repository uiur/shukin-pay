import * as React from 'react'
import { fetchPrice } from '../PriceApi'

declare var web3: any

export interface Props {
  title: string
  amount: number
  address: string
}

export default class PayRoot extends React.Component<Props, { price?: any }> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

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

  roundEthValue (value: number): number {
    const million = 1000 * 1000
    return Math.round(value * million) / million
  }

  render () {
    const props = this.props

    return (
      <div>
        <h1>集金ペイ</h1>

        <h1>{ props.title }</h1>

        <p>{ this.roundEthValue(props.amount) } ETH { this.state.price && `(${Math.round(props.amount * this.state.price.JPY)} 円分)` } をお願いします。</p>
        <p>レート: { this.state.price && Math.round(this.state.price.JPY) } 円 / ETH</p>
        <p>{ props.address }</p>
        <button onClick={ this.submit.bind(this) }>Metamaskで支払う</button>
      </div>
    )
  }
}
