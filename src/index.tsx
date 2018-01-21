import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Web3 from 'web3'
import CreateRoot from './components/CreateRoot'
import PayRoot from './components/PayRoot'

declare var web3: any

class RootComponent extends React.Component<{}, {}> {
  parseQuery () {
    const url = new window.URL(window.location.href)

    return {
      title: url.searchParams.get('title'),
      address: url.searchParams.get('address'),
      amount: parseFloat(url.searchParams.get('amount'))
    }
  }

  render () {
    const params = this.parseQuery()
    const isPay = params.address && params.amount

    if (isPay) {
      return (
        <PayRoot address={ params.address } amount={ params.amount } title={ params.title } />
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
