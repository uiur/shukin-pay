import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as queryString from 'query-string'
import { fetchPrice } from '../PriceApi'
import { roundEthValue } from '../utils'

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

        <div className='mb-4'>
          <label>タイトル (任意)</label>

          <input
            className='form-control'
            type='text'
            placeholder='イベント名や勉強会名など'
            value={ this.state.title || '' }
            onChange={ this.titleOnChange.bind(this) } />
        </div>

        <div className='mb-4'>
          <label>合計金額 (日本円)</label>
          <input className='form-control' type='number' min={0} value={ this.state.total } onChange={ this.totalOnChange.bind(this) } />
        </div>

        <div className='mb-4'>
          <label>人数</label>
          <input className='form-control' type='number' min={0} value={ this.state.count } onChange={ this.countOnChange.bind(this) } />
        </div>

        <section>
          <h2>{ this.amount() }円 = { roundEthValue(this.amountInEth()) } ETH</h2>
          <p>を1人あたり集めます 🙋 (レート: { this.state.price && Math.round(this.state.price.JPY) } 円 / ETH) </p>
        </section>

        <div className='mb-4'>
          <label>送金先アドレス</label>
          <input className='form-control' type="text" placeholder='0x1234567890...' value={ this.state.address } onChange={this.addressOnChange.bind(this)} />
        </div>

        <button
          className='btn btn-primary btn-lg btn-block'
          disabled={!this.inputsAreValid()}
          onClick={ this.redirectToPayPage.bind(this) }>集金ページを作る</button>
      </div>
    )
  }
}
