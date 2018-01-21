import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Web3 from 'web3'
import * as Frisbee from 'frisbee'
import { fetchPrice } from './PriceApi'
import CreateRoot from './components/CreateRoot'

declare var web3: any

interface State {
  desc: string
  to: string
  amount: number
  price?: any
}

class RootComponent extends React.Component<{}, State> {
  constructor (props: any) {
    super(props)
    const params = this.parseQuery()

    // TODO: check format
    this.state = {
      desc: params.desc,
      to: params.to,
      amount: params.amount
    }
  }

  componentDidMount () {
    fetchPrice().then((price: any) => {
      this.setState({ price })
    })
  }

  parseQuery () {
    const url = new window.URL(window.location.href)

    return {
      desc: url.searchParams.get('desc'),
      to: url.searchParams.get('address'),
      amount: parseFloat(url.searchParams.get('amount'))
    }
  }

  submit () {
    const account = web3.eth.accounts[0]
    web3.eth.sendTransaction({
      from: account,
      to: this.state.to,
      value: web3.toWei(this.state.amount, 'ether')
    }, (err: Error, transactionHash: string) => {
      if (err) return console.error(err)

      console.log(transactionHash)
    })
  }

  render () {
    const account = web3.eth.accounts[0]

    const isPay = this.state.to && this.state.amount

    if (isPay) {
      return (
        <div>
          <h1>{ this.state.desc }</h1>

          <p>{ this.state.amount } eth</p>
          <p>rate: { this.state.price && this.state.price.JPY } jpy / eth</p>
          <p>{ this.state.to }</p>
          <button onClick={ this.submit.bind(this) }>Send</button>
        </div>
      )
    } else {
      return (
        <CreateRoot />
      )
    }
  }
}

function run () {
  ReactDOM.render(
    (
      <RootComponent />
    ),
    document.getElementById('content')
  )
}

window.addEventListener('load', () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  run()
})
