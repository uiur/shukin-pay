import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { fetchPrice } from '../PriceApi'

interface State {
  total: number
  count: number
  address: string
  price?: any
}

export default class CreateRoot extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)

    this.state = {
      total: 6000,
      count: 4,
      address: ''
    }
  }

  componentDidMount () {
    fetchPrice().then((price: any) => {
      this.setState({ price })
    })
  }

  totalOnChange(e: any) {
    this.setState({ total: e.target.value })
  }

  countOnChange (e: any) {
    this.setState({ count: e.target.value })
  }

  addressOnChange (e: any) {
    this.setState({ address: e.target.value })
  }

  amount () {
    return Math.ceil(this.state.total / this.state.count)
  }

  amountInEth () {
    return this.state.price && (this.amount() / this.state.price.JPY)
  }

  buildPayUrl () {
    return `/?address=${this.state.address}&amount=${this.amountInEth()}&desc='test'`
  }

  redirectToPayPage () {
    window.location.href = this.buildPayUrl()
  }

  render () {
    return (
      <div>
        <h1>集金ペイ</h1>
        <p>イベントや勉強会などの割り勘代金をEthereumで簡単に集められます。集金ページを作ってリンクをチャットなどに共有するだけ！</p>

        <h2>合計金額</h2>

        <div>
          <input type='number' value={ this.state.total } onChange={ this.totalOnChange.bind(this) } /> 円
        </div>

        <h2>人数</h2>

        <div>
          <input type='number' value={ this.state.count } onChange={ this.countOnChange.bind(this) } /> 人
        </div>

        <h2>1人あたり { this.amount() }円 = { this.amountInEth() } ETH </h2>
        <p>レート: { this.state.price && this.state.price.JPY } 円 / ETH </p>

        <h2>送金先アドレス</h2>

        <div>
          <input type="text" placeholder='0x1234567890...' value={ this.state.address } onChange={this.addressOnChange.bind(this)} />
        </div>

        <button onClick={ this.redirectToPayPage.bind(this) }>集金ページを作る</button>
      </div>
    )
  }
}
