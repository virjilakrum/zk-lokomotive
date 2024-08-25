import Arweave from 'arweave/web';

const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})

//Get Public Key Registered
const getArPublicKey = async(arAddress) => {
    try{
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arAddress
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'ar-crypto-storage-public-key'
        }     
      }
      const txids = await arweave.arql(query);
      if(txids.length === 0){
        console.log('nada')
        return false
      }else{
        const transaction = await arweave.transactions.get(txids[0])
        const publicKey = await transaction.get('data', {decode: true, string: true})
        return publicKey
      }
    }catch(err){
      console.log(err)
      return false
    }  
}

//Get Data encrypt with the user wallet
const getUserPrivateData = async (address) => {
    try{
      let arAdd
      if(!address){
        arAdd = this.state.arUserAddress
      }else{
        arAdd = address
      }
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arAdd
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'ar-crypto-storage'
        }     
      }
      const txids = await arweave.arql(query);
      return txids
    }catch(err){
      console.log(err)
      return[]
    }  
}

//Get data receive by the user
const getUserArReceiveList = async(address) => {
    try{
      let arAdd
      if(!address){
        arAdd = this.state.arUserAddress
      }else{
        arAdd = address
      }
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'Destination',
            expr2: arAdd
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'ar-crypto-storage-mail'
        }     
      }
      const txids = await arweave.arql(query);
      if(txids.length === 0){
        return []
      }else{
        let data = []
        txids.map(txId => data.push(getReceiveArData(txId)))
        const resultData = await Promise.all(data)
        return resultData
      }
    }catch(err){
      console.log(err)
      return []
    } 
}

//Get info about tx receive data
const getReceiveArData = async(txId) => {
    return new Promise(async function(resolve, reject){
        try{
          const tx = await arweave.transactions.get(txId)
          const from = await arweave.wallets.ownerToAddress(tx.owner)
          resolve({txId, address:`from: ${from}`})
        }catch(err){
          resolve({error:true, err})
        }
})}

//Get data send by the user
const getUserArSendList = async(address) => {
    try{
      let arAdd
      if(!address){
        arAdd = this.state.arUserAddress
      }else{
        arAdd = address
      }
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arAdd
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'ar-crypto-storage-mail'
        }     
      }
      const txids = await arweave.arql(query);
      if(txids.length === 0){
        return []
      }else{
        let data = []
        txids.map(txId => data.push(getSendArData(txId)))
        const resultData = await Promise.all(data)
        return resultData
      }
    }catch(err){
      console.log(err)
      return []
    } 
}

//Get info about tx send data
const getSendArData = async(txId) => {
    return new Promise(async function(resolve, reject){
      try{
        const tx = await arweave.transactions.get(txId)
        let tags =  await tx.get('tags')
        const to = Buffer.from(tags[1].value, 'base64').toString('ascii')
        resolve({txId, address:`to: ${to}`})
      }catch(err){
        resolve({error:true, err})
      }
      })
}





  export{
    getArPublicKey,
    getUserPrivateData,
    arweave,
    getUserArReceiveList,
    getUserArSendList

  }