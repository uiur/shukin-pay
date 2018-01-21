import * as Frisbee from 'frisbee'

const api = new Frisbee({
  baseURI: 'https://min-api.cryptocompare.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export function fetchPrice () {
  return api.get('/data/price?fsym=ETH&tsyms=ETH,USD,JPY').then((res: any) => res.body)
}
