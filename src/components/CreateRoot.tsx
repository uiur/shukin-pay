import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { fetchPrice } from '../PriceApi'
import * as queryString from 'query-string'

interface State {
  total: number
  count: number
  address: string
  title?: string
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

  titleOnChange (e: any) {
    this.setState({ title: e.target.value })
  }

  amount () {
    return Math.ceil(this.state.total / this.state.count)
  }

  amountInEth () {
    return this.state.price && (this.amount() / this.state.price.JPY)
  }


  buildPayUrl () {
    const query = {
      address: this.state.address,
      amount: '' + this.amountInEth(),
      title: this.state.title
    }

    return `/?${queryString.stringify(query)}`
  }

  redirectToPayPage () {
    window.location.href = this.buildPayUrl()
  }

  inputsAreValid () {
    return this.amountInEth() > 0 && window.web3.isAddress(this.state.address)
  }

  render () {
    return (
      <div className='container'>
        <h1>集金ペイ</h1>
        <p>イベントや勉強会などの割り勘代金をEthereumで簡単に集められます。集金ページを作ってリンクをチャットなどに共有するだけ！</p>

        <div>
          <h2>タイトル (任意)</h2>
          <input
            className='form-control'
            type='text'
            placeholder='イベント名や勉強会名など'
            value={ this.state.title || '' }
            onChange={ this.titleOnChange.bind(this) } />
        </div>


        <div>
          <h2>合計金額 (日本円)</h2>
          <input className='form-control' type='number' min={0} value={ this.state.total } onChange={ this.totalOnChange.bind(this) } />
        </div>

        <div>
          <h2>人数</h2>
          <input className='form-control' type='number' min={0} value={ this.state.count } onChange={ this.countOnChange.bind(this) } />
        </div>

        <section>
          <h2>1人あたり { this.amount() }円 = { this.amountInEth() } ETH </h2>
          <p>レート: { this.state.price && this.state.price.JPY } 円 / ETH </p>
        </section>

        <div>
          <h2>送金先アドレス</h2>
          <input className='form-control' type="text" placeholder='0x1234567890...' value={ this.state.address } onChange={this.addressOnChange.bind(this)} />
        </div>

        <button
          className='btn btn-primary btn-lg'
          disabled={!this.inputsAreValid()}
          onClick={ this.redirectToPayPage.bind(this) }>集金ページを作る</button>
      </div>
    )
  }
}
