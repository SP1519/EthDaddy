const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether') //tokenshelper, convert cryptocurrency to tokens
}

//smoke testing
describe("ETHDaddy", () => { //main function for testing
  let ethDaddy
  let deployer, owner1

  const NAME ='ETH Daddy'
  const SYMBOL ='ETHD'


  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners();

    // Deploy contract
    const ETHDaddy = await ethers.getContractFactory('ETHDaddy')
    ethDaddy = await ETHDaddy.deploy('ETH Daddy', 'ETHD')
  
    //list a domain
    const transaction = await ethDaddy.connect(deployer).list("jack.eth", tokens(10)) //talk to smart contract on behalf of deployer
    await transaction.wait()


  })

  describe ('Deployment', () =>{
      it('has a name', async () => {    
      const result = await ethDaddy.name() //.name is variable also function within .sol file
      expect(result).to.equal(NAME)

    })

    it('has a symbol', async () => {
      const result = await ethDaddy.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it('Sets the owner', async () => {
      const result = await ethDaddy.owner()
      expect(result).to.equal(deployer.address)
    })  

    it("Returs the max supply", async () => {
      const result= await ethDaddy.maxSupply()
      expect(result).to.equal(1)
    })

    it("Returns the total supply", async () => {
      const result= await ethDaddy.totalSupply()
      expect(result).to.equal(0)
    })
})

  describe("Domain", ()=> {
    it("Returns domain attributes", async () =>{
      let domain = await ethDaddy.getDomain(1);
      expect(domain.name).to.be.equal("jack.eth")
      expect(domain.cost).to.be.equal(tokens(10))
      expect(domain.isOwned).to.be.equal(false)
    }) 
  })

  describe("Minting", ()=> {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')

    beforeEach(async () => {
      const transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT})
      await transaction.wait()
    })


    it("Updates the owner", async () =>{
      const owner = await ethDaddy.ownerOf(ID)
      expect(owner).to.be.equal(owner1.address)
      })

    it("Updates domain status", async () =>{
      const domain = await ethDaddy.getDomain(ID)
      expect(domain.isOwned).to.be.equal(true)

    })

    it("Updates contract balance", async () => {
      const result = await ethDaddy.getBalance()
      expect(result).to.be.equal(AMOUNT)
    })

    it("Updates total supply", async () => {
      const result = await ethDaddy.totalSupply()
      expect(result).to.be.equal(1)
    })

    })

  describe("Withdraw", () =>{
    const ID=1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () =>{
      balanceBefore = await ethers.provider.getBalance(deployer.address)//ethers.provider= read only abstraction in ethereum network

      let transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT})
      await transaction.wait()

      transaction = await ethDaddy.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethDaddy.getBalance()
      expect(result).to.equal(0)
    })

  })
})


