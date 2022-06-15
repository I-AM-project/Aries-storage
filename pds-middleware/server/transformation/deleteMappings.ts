

function delete_firstname(value:string){
    try{
        return(`PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>

        Delete {
            ?PersonFullName a cco:PersonFullName ;
                       <http://purl.obolibrary.org/obo/BFO_0000051> ?PersonGivenName .
                   ?PersonGivenName a cco:PersonGivenName ;
                       <http://purl.obolibrary.org/obo/RO_0010001>  ?PersonGivenNameIBE . 
                   ?PersonGivenNameIBE cco:has_text_value ?FirstName. 
        ?PersonGivenName a cco:PersonGivenName ;
                       <http://purl.obolibrary.org/obo/RO_0010001>  ?PersonGivenNameIBE . 
                   ?PersonGivenNameIBE cco:has_text_value ?FirstName. 
                 
         }where{
       ?PersonFullName a cco:PersonFullName ;
                       <http://purl.obolibrary.org/obo/BFO_0000051> ?PersonGivenName .
                   ?PersonGivenName a cco:PersonGivenName ;
                       <http://purl.obolibrary.org/obo/RO_0010001>  ?PersonGivenNameIBE . 
                   ?PersonGivenNameIBE cco:has_text_value ?FirstName. 
        ?PersonGivenName a cco:PersonGivenName ;
                       <http://purl.obolibrary.org/obo/RO_0010001>  ?PersonGivenNameIBE . 
                   ?PersonGivenNameIBE cco:has_text_value ?FirstName. 
           FILTER(?FirstName = "${value}")
       
     }
    `)
    }catch(error){
        console.log(error)
        return ""
    }
}


function delete_lastname(value: string){
    try{
        return(`PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>

   Delete {
         ?PersonFullName a cco:PersonFullName ;
                  <http://purl.obolibrary.org/obo/BFO_0000051> ?PersonFamilyName.
     		?PersonFamilyName a cco:PersonFamilyName ;
                    <http://purl.obolibrary.org/obo/RO_0010001> ?PersonFamilyNameIBE. 
  
  			?PersonFamilyNameIBE cco:has_text_value ?LastName . 
    		
    }where{
           
         ?PersonFullName a cco:PersonFullName ;
                  <http://purl.obolibrary.org/obo/BFO_0000051> ?PersonFamilyName.
     		?PersonFamilyName a cco:PersonFamilyName ;
                    <http://purl.obolibrary.org/obo/RO_0010001> ?PersonFamilyNameIBE. 
  
  			?PersonFamilyNameIBE cco:has_text_value ?LastName . 
  	FILTER(?LastName = "${value}")
  
}`)
    }catch(error){
        console.log(error)
        return ""
    }
}


function delete_DateOfBirth(value:string){
    try{
        return(`PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>

        Delete {
     
     ?Birth a cco:Birth;
              cco:occurs_on ?Birth_Day. 
       
       # Date Of Birth
       ?Birth_Day a cco:Day;
                  cco:designated_by ?DataIdentifier . 
       
       ?DataIdentifier <http://purl.obolibrary.org/obo/RO_0010001> ?DataIdentifierIBE . 
       
       ?DataIdentifierIBE  cco:has_text_value ?DateOfBirth .  
                 
         }where{
                
       ?Birth a cco:Birth;
              cco:occurs_on ?Birth_Day. 
       
       # Date Of Birth
       ?Birth_Day a cco:Day;
                  cco:designated_by ?DataIdentifier . 
       
       ?DataIdentifier <http://purl.obolibrary.org/obo/RO_0010001> ?DataIdentifierIBE . 
       
       ?DataIdentifierIBE  cco:has_text_value ?DateOfBirth .  
           FILTER(?DateOfBirth = "${value}")
       
     }
     `)
    } catch(error){
        console.log(error)
        return ""
    }
}


function delete_homemailingaddres(value:string){
    try{
        return(`PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>
        PREFIX obo: <http://purl.obolibrary.org/obo/>
           Delete {
        
         ?ActOfResiding a cco:ActOfResiding;
               obo:RO_0000057 ?ResidentialFacility.
        
              ?ResidentialFacility a cco:ResidentialFacility;
                cco:designated_by ?StreetAdress.
        
              ?StreetAdress a cco:StreetAdress;
                obo:RO_0010001 ?StreetAdressIBE .
        
              ?StreetAdressIBE a cco:InformationBearingEntity;
              cco:has_text_value ?HomeMailingAddress.
                    
            }where{
                   
           ?ActOfResiding a cco:ActOfResiding;
               obo:RO_0000057 ?ResidentialFacility.
        
              ?ResidentialFacility a cco:ResidentialFacility;
                cco:designated_by ?StreetAdress.
        
              ?StreetAdress a cco:StreetAdress;
                obo:RO_0010001 ?StreetAdressIBE .
        
              ?StreetAdressIBE a cco:InformationBearingEntity;
              cco:has_text_value ?HomeMailingAddress.
              FILTER(?HomeMailingAddress = "${value}")
          
        }
        `)
    } catch(error){
        console.log(error)
        return ""
    }
}



function delete_homepostalcode(value:string){
    try{
        return (`PREFIX cco: <http://www.ontologyrepository.com/CommonCoreOntologies/>
        PREFIX obo: <http://purl.obolibrary.org/obo/>
           Delete {
        
         ?ActOfResiding a cco:ActOfResiding ; 
                         obo:RO_0000057 ?ResidentialFacility. 
          
          ?ResidentialFacility a cco:ResidentialFacility;
                               <http://purl.obolibrary.org/obo/RO_0001025> ?PostalZone1.
                                
           
         
         ?PostalZone1 a cco:PostalZone;
                      cco:designated_by ?PostalZoneCode1.
          
          ?PostalZoneCode1 a cco:PostalCode;
                        <http://purl.obolibrary.org/obo/RO_0010001> ?PostalZoneCode1IBE . 
          
          ?PostalZoneCode1IBE  cco:has_text_value ?HomePostalCode. 
                    
            }where{
                   
         ?ActOfResiding a cco:ActOfResiding ; 
                         obo:RO_0000057 ?ResidentialFacility. 
          
          ?ResidentialFacility a cco:ResidentialFacility;
                               <http://purl.obolibrary.org/obo/RO_0001025> ?PostalZone1.
                                
           
         
         ?PostalZone1 a cco:PostalZone;
                      cco:designated_by ?PostalZoneCode1.
          
          ?PostalZoneCode1 a cco:PostalCode;
                        <http://purl.obolibrary.org/obo/RO_0010001> ?PostalZoneCode1IBE . 
          
          ?PostalZoneCode1IBE  cco:has_text_value ?HomePostalCode. 
          
              FILTER(?HomePostalCode = "${value}")
          
        }
        
        `)
    }catch(error){
        console.log(error)
        return ""
    }
}

function mappingDeleteFuction(attribute: string , value: string){
    let attributeClean = attribute.toLocaleLowerCase()
    switch(attributeClean){
      case "firstname": {
        return delete_firstname(value)
      }
      case "email":{
        return delete_email(value)
      }
      case "lastname": {
        return delete_lastname(value)
      }
      case "dateofbirth" : {
        return delete_DateOfBirth(value)
      }
      case "homemailingaddress" : {
        return delete_homemailingaddres(value)
      }
      case "mailingcity":{
        return delete_mailingcity(value)
      }
      case "mailingstate":{
        return delete_mailingstate(value)
      } 
      case "homepostalcode":{
        return delete_homepostalcode(value)
      }
      case "mailingcountry":{
        return delete_mailingcountry(value)
      }
      case "homephonenumber": {
        return delete_homephonenumber(value)
      }
      case "mobilephonenumber": {
        return delete_mobilephonenumber(value)
      }
      case "employername": {
        return delete_employername(value)
      }
      case "employeetitle":{
        return delete_employeetitle(value)
      }
      default:{
        return ""
      }
    }
}

export default mappingDeleteFuction