import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Web3 from 'web3'
import * as Frisbee from 'frisbee'

declare var web3: any

const api = new Frisbee({
  baseURI: 'https://min-api.cryptocompare.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

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
    api.get('/data/price?fsym=ETH&tsyms=ETH,USD,JPY').then((res: any) => {
      this.setState({ price: res.body })
    })
  }

  parseQuery () {
    const url = new window.URL(window.location.href)

    return {
      desc: url.searchParams.get('desc'),
      to: url.searchParams.get('to'),
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
    return (
      <div>
        <p>{ this.state.amount } eth</p>
        <h1>{ this.state.desc }</h1>
        <p>{ this.state.to }</p>
        <p>{ this.state.price && this.state.price.JPY } jpy / eth</p>
        <button onClick={ this.submit.bind(this) }>Send</button>
      </div>
    )
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
