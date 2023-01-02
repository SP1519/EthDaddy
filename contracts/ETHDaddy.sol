// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
	uint256 public maxSupply; //number of domains that are listed (listed domains but not bought yet)
	uint256 public totalSupply;//actual number of how many domains/nfts have been created
	address public owner;

	struct Domain {
		string name;
		uint256 cost;
		bool isOwned;
	}

	mapping(uint256 => Domain) domains; //assign values + save in domains variable

	modifier onlyOwner(){ //used to modify functions before execution(or after)
		require(msg.sender==owner);
		_; //_ run the function body after require was tested
	}

	 constructor(string memory _name, string memory _symbol) //passing this into ERC721
	 ERC721(_name, _symbol) 
	 {
	 	owner=msg.sender;
	 }

	 function list(string memory _name, uint256 _cost) public onlyOwner { //creates an domainname+saves to maping and onlyowner can call
	 	maxSupply = maxSupply +1;
	 	domains[maxSupply] = Domain(_name, _cost, false);//type index for domain will be saved to blockchain
	 }

	 function mint(uint256 _id) public payable { //payable - function is able to send and receive ether
	 	//mints nft to adress of caller and ads id to new owner
	 	require(_id != 0);
	 	require(_id<= maxSupply);
	 	require(domains[_id].isOwned==false);
	 	require(msg.value >= domains [_id].cost);



	 	domains[_id].isOwned = true; //sets new domain name as owned
	 	totalSupply++;


	 	_safeMint(msg.sender, _id); 
	 		//tokenId (in ERC721.sol) = unique identifier number for NFT after minting
	 }

	 function getDomain(uint256 _id) public view returns (Domain memory){
	 	return domains[_id]; //access domain by ID instead of public function in mapping
	 }

	 function getBalance() public view returns (uint256){
	 	return address(this).balance;	//this= address of smart contract
	 }

	 function withdraw() public onlyOwner { //withdraw ethers sent to contract from buyer to contract owner
	 	(bool success, ) = owner.call{value: address(this).balance}("");
	 	require(success);
	 }
}
	

	/*"npx hardhat run scripts/deploy.js --network localhost" //deploy contract

npx hardhat node

website run - npm run start*/