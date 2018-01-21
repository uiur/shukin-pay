import * as React from 'react'
import { roundEthValue } from '../utils'
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

  addressUrl (address: string): string {
    return `https://etherscan.io/address/${address}`
  }

  render () {
    const props = this.props

    return (
      <div className='container'>
        <h1>集金ペイ</h1>

        <h1>{ props.title }</h1>

        <section>
          <p><b>{ roundEthValue(props.amount) } ETH { this.state.price && `(${Math.round(props.amount * this.state.price.JPY)} 円分)` }</b> の支払いをお願いします🙇 </p>
          <p>レート: { this.state.price && Math.round(this.state.price.JPY) } 円 / ETH</p>
        </section>

        <section>
          <a href={this.addressUrl(props.address)} target='_blank'>{ props.address }</a>
        </section>

        <button className='btn btn-lg btn-primary' onClick={this.submit.bind(this)}>Metamaskで支払う</button>
      </div>
    )
  }
}
