import * as React from 'react'
import { roundEthValue } from '../utils'
import { fetchPrice } from '../PriceApi'

declare var web3: any

export interface Props {
  title: string
  amount: number
  address: string
}

export default class PayRoot extends React.Component<Props, { price?: any, transactionHash?: string }> {
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

      this.setState({ transactionHash })
    })

  }

  addressUrl (address: string): string {
    return `https://etherscan.io/address/${address}`
  }

  metamaskEnabled (): boolean {
    return !!(web3 && web3.currentProvider)
  }

  render () {
    const props = this.props

    return (
      <div className='container'>
        <a href='/'><b>集金ペイ</b></a>

        {
          props.title &&
            <h2 className='my-4'>{ props.title }</h2>
        }

        <section className='mb-4'>
          <p className='pay-amount-desc'><b>{ roundEthValue(props.amount) } ETH { this.state.price && `(${Math.round(props.amount * this.state.price.JPY)} 円分)` }</b></p>
          <p>の支払いをお願いします🙇</p>
        </section>

        <section className='mb-4'>
          <span>送金先アドレス</span>
          <p className='pay-address'><a href={this.addressUrl(props.address)} target='_blank'>{ props.address }</a></p>
        </section>

        {
          this.metamaskEnabled() &&
            <button
              className='mb-2 btn btn-lg btn-primary btn-block'
              disabled={!!this.state.transactionHash}
              onClick={this.submit.bind(this)}>
              Metamaskで支払う
            </button>
        }

        {
          !this.metamaskEnabled() &&
            <p>Metamaskをインストールするとこのページから直接支払えます。</p>
        }

        <p>また、ウォレットから送金先アドレスに直接送ることもできます。</p>

        {
          this.state.transactionHash &&
            <section className='pay-success'>
              ✅ 支払いに成功しました &nbsp;
              <a href={`https://etherscan.io/tx/${this.state.transactionHash}`} target='_blank'>確認する</a>
            </section>
        }
      </div>
    )
  }
}
