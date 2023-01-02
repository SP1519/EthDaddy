import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import ETHDaddy from './abis/ETHDaddy.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null) //react hook

  const [ethDaddy, setETHDaddy] = useState(null)
  const [domains, setDomains] = useState([])

  const loadBlockchainData = async () =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum) //link to blockchain ether connect to metamask metamask talk to blockchain
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network) //hardhat network

    const ethDaddy = new ethers.Contract(config[network.chainId].ETHDaddy.address, ETHDaddy, provider)  //Javascript versoin of smart contract in ethers to list domains
    setETHDaddy(ethDaddy)

    const maxSupply = await ethDaddy.maxSupply()
    //console.log(maxSupply.toString()) //shows all 6 domains
    const domains = []

    for (var i = 1; i <=  maxSupply; i++) {
      const domain = await ethDaddy.getDomain(i)
      domains.push(domain)
    }

    setDomains(domains)
    //console.log(domains)

    window.ethereum.on('accountsChanged', async () =>{
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => { //react hook - call blockchaindata when function APP gets rendered
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
        
        <Search/>

          <div className="cards__section">

            <h2 className="cards__title">abcd</h2>
            <p className="cards__description">
              abcdefgh
            </p> 

            <hr />

            <div className="cards">
              {domains.map((domain, index) => (
                <Domain domain= {domain} ethDaddy={ethDaddy} provider={provider} id={index + 1} key={index} />


                //<p key={index}>{domain.name}</p> - lists domains
              ))}

            </div>



          </div>

    </div>
  );
}

export default App;


/*window in console = object in js shows all infos of window that is shown
    window.ethereum in console= connection provided to browser from metmask
      metamask turn browser into blockchain browser to hold wallets and sign transactions
        window.ethereum allows to fetch account into website
        window.ethereum = direct communication with  metamask
  metamask connects browser to blockchain , ->ethers connects clientside (userinterface, functions that client is able to use) to blockchain

    */
