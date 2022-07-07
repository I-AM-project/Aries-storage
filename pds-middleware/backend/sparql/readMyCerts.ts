import fetch from "node-fetch"

const allCertsQuery = `PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>

select ?Person ?KeyPair ?PublicKey ?PrivateKey where{
 	?Person a cco:Person;
          cco:agent_in ?ActOfOwnerShip. 
  
 	?ActOfOwnerShip a cco:ActOfOwnership ;
  		cco:has_object ?RSAKeyPair. 
  
  	?RSAKeyPair a cco:RSAKeyPair ;
               cco:designated_by  ?KeyPairDesc ;
               cco:has_object ?PublicKeyIBA;
               cco:has_object ?PrivateKeyIBA. 
  
  ?KeyPairDesc a cco:DesignativeName;
               <http://purl.obolibrary.org/obo/RO_0010001> ?KeyPairDescIBE.
  
  ?KeyPairDescIBE cco:has_text_value ?KeyPair . 
  
    ?PublicKeyIBA a cco:RSAPublicKey;
               cco:has_text_value ?PublicKey.
  
  ?PrivateKeyIBA a cco:RSAPrivateKey;
               cco:has_text_value ?PrivateKey.
}`

function createCertQuery(certName) {
    let query = `PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>

    select ?Person ?KeyPair ?PublicKey ?PrivateKey where{
         ?Person a cco:Person;
              cco:agent_in ?ActOfOwnerShip. 
      
         ?ActOfOwnerShip a cco:ActOfOwnership ;
              cco:has_object ?RSAKeyPair. 
      
          ?RSAKeyPair a cco:RSAKeyPair ;
                   cco:designated_by  ?KeyPairDesc ;
                   cco:has_object ?PublicKeyIBA;
                   cco:has_object ?PrivateKeyIBA. 
      
      ?KeyPairDesc a cco:DesignativeName;
                   <http://purl.obolibrary.org/obo/RO_0010001> ?KeyPairDescIBE.
      
      ?KeyPairDescIBE cco:has_text_value "${certName.replace(/\s/g, '')}" . 
      
        ?PublicKeyIBA a cco:RSAPublicKey;
                   cco:has_text_value ?PublicKey.
      
      ?PrivateKeyIBA a cco:RSAPrivateKey;
                   cco:has_text_value ?PrivateKey.
    }`
    return query
}

export function readCertByName(certName: string, callback: ({ success: boolean, data: string }) => void) {
    let query = createCertQuery(certName)
    fetch('http://iamtestingbed.com:3030/MyData/sparql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/json'
        },
        body: query
    }).then(res => res.text()).then(data => {
        let jsonResults = JSON.parse(data)
        if (jsonResults.results.bindings[0] != undefined) {
            callback({
                success: true,
                data: jsonResults.results.bindings[0]
            })
        } else {
            callback({
                success: true,
                data: ""
            })
        }


    }).catch((error) => {
        callback({
            success: false,
            data: error
        })
    })
}

export function readMyCerts(callback: ({ success: boolean, data: string }) => void) {
    fetch('http://iamtestingbed.com:3030/MyData/sparql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/json'
        },
        body: allCertsQuery
    }).then(res => res.text()).then(data => {
        let jsonResults = JSON.parse(data)
        let keyPairArray = []
        for (let keyPairs of jsonResults.results.bindings) {
            let ParseKeyPairObj = {
                person: keyPairs["Person"].value,
                keyPairName: keyPairs["KeyPair"].value,
                publicKey: keyPairs["PublicKey"].value
            }
            keyPairArray.push(ParseKeyPairObj)
        }

        callback({
            success: true,
            data: keyPairArray
        })
    }).catch((error) => {
        callback({
            success: false,
            data: error
        })
    })
}

