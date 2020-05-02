let icons = {
    "mempool.space": require('../../assets/explorers/mempool.space.png'),
    "blockchair.com": require('../../assets/explorers/blockchair.com.png'),
    "blockstream.info": require('../../assets/explorers/blockstream.info.png'),
    "tradeblock.com": require('../../assets/explorers/tradeblock.com.png'),
    "blockcypher.com": require('../../assets/explorers/blockcypher.com.png'),
    "coinmarketcap.com": require('../../assets/explorers/coinmarketcap.com.png'),
    "blockchain.com": require('../../assets/explorers/blockchain.com.png'),
    "smartbit.com.au": require('../../assets/explorers/smartbit.com.au.png'),
};

let explorers = [
    {name: "mempool.space", pattern: "https://mempool.space/address/{address}"},
    {name: "blockchair.com", pattern: "https://blockchair.com/bitcoin/address/{address}"},
    {name: "blockstream.info", pattern: "https://blockstream.info/address/{address}"},
    {name: "tradeblock.com", pattern: "https://tradeblock.com/bitcoin/address/{address}"},
    {name: "blockcypher.com", pattern: "https://live.blockcypher.com/btc/address/{address}"},
    {name: "coinmarketcap.com", pattern: "https://blockchain.coinmarketcap.com/address/bitcoin/{address}"},
    {name: "blockchain.com", pattern: "https://www.blockchain.com/btc/address/{address}"},
    {name: "smartbit.com.au", pattern: "https://www.smartbit.com.au/address/{address}"},
//    {name: "otx.me", pattern: "https://oxt.me/address/{address}"},
    //{name:"blockexplorer.com", pattern: ""},
    //{name:"btc.com", pattern: ""},
].map(explorer => ({...explorer, icon: icons[explorer.name]}));

export default explorers;


/**
 https://mempool.space/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://blockchair.com/bitcoin/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://blockstream.info/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://oxt.me/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://tradeblock.com/bitcoin/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://live.blockcypher.com/btc/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://blockchain.coinmarketcap.com/address/bitcoin/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://www.blockchain.com/btc/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL
 https://www.smartbit.com.au/address/1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL

 */
