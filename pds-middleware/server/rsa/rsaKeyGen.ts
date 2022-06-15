import {generateKeyPairSync} from "crypto"
function uploadRSAKeys(person: string, keyPairName:string, publicKey:string, encryptedPrivateKey:string){
    try{
        let query = `PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>
        PREFIX obo: <http://purl.obolibrary.org/obo/>
            
        INSERT DATA
        { 
            ${person} a cco:Person ;
                cco:agent_in cco:ActOfOwnership_${keyPairName} . 

            cco:ActOfOwnership_${keyPairName} cco:ActOfOwnership
                cco:has_object cco:RSAKeyPair_${keyPairName} . 
            
            cco:RSAKeyPair_${keyPairName} a cco:RSAKeyPair ;
                cco:has_object cco:RSAPublicKey_${keyPairName} ;
                cco:has_object cco:RSAPrivateKey_${keyPairName} ; 
                cco:designated_by cco:RSAKeyPairDesc_${keyPairName} . 

            cco:RSAKeyPairDesc_${keyPairName} a cco:DesignativeName;
                obo:RO_0010001 cco:InformationBearingEntity_RSAKeyPairDesc_${keyPairName} .
            
            cco:InformationBearingEntity_RSAKeyPairDesc_${keyPairName} a cco:InformationBearingEntity ;
            cco:has_text_value "${keyPairName}". 

            cco:RSAPublicKey_${keyPairName} a cco:RSAPublicKey ; 
                cco:has_text_value "${publicKey}". 

            cco:RSAPrivateKey_${keyPairName} a cco:RSAPrivateKey ; 
            cco:has_text_value "${encryptedPrivateKey}". 
        }
        `

        console.log(query)
        // fetch('http://localhost:3030/MyData', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/sparql-update',
        //         "Accept": "*/*"

        //     },
        //     body: query
        // }).then( res => res).then(data => {

        //    return true
        // }).catch((error) => {
        //     console.log(console.log(error) )
        //     return false
        // })

    }catch(error){
        return false
    }
}

function createRSAKeyPair(person:string, keyPairName: string, passphrase: string , callback: ({ success: boolean, data: string }) => void){
    try{
        // TODO Hash and salt passphrase
        const {
            publicKey,
            privateKey,
          } = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: `${passphrase}`
              }
          });
          console.log(publicKey)
          console.log(privateKey)
          uploadRSAKeys(person, keyPairName, publicKey, privateKey)

         
    }catch(error){

    }
}


export default createRSAKeyPair