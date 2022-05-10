# Aries-storage

## Introduction
This is an architecture for a database designed to store verifyable credentials and other miscellanious information associated with an Aries wallet. It is intended to run on the cloud, and can serve several users while still guaranteeing that only the user can access their data.

## Input format
The server would receive PUT, POST, and GET requests from the agent. Before anything else, it would check that the agent is authorized to use the data it is trying to access (the details will vary depending on the chain provider; in Sovrin's case, you would use the policy oracle). All requests would have a path parameter with the rdfs:label property of the class they are using to represent the data. The ontology would be either stored locally on the machine with the server or queried from a separate database. 
### POST requests
POST requests would add the class to the triples in the user's triple store.
### PUT requests
PUT requests would update the values associated with the class.
### GET requests
GET requests would cause the server to retrieve the properties of the class. Each class would have predetermined properties that it would be associated with.

## Encryption and security
All of the data on the server would be encrypted via AES-GCM. Each file would store the encryption key used to encrypt the data. <b>The key would be stored encrypted with the agent's public key. Note that this means the server cannot decrypt the triples on its own.</b> The encrypted data and key would be sent to the agent upon a GET request. Note that, for several agents to access the same data, there must be a copy for each agent, and changes would need to be applied to every copy. The encryption_example.py file in the repository showcases how this encryption scheme would work on the server side.
### Implications
This scheme prevents the cloud service provider from sharing the data aggregated on the server. It also offers protection if the server is hacked. It offers no protection from an agent getting hacked. For this reason, it is recommended to try to find a service that allows agents to be given specific, narrow permissions. This server can service an arbitrary number of agents without risk of them reading each others' data, even if there is a flaw in the authentication, assuming the encryption is done safely.  
### Server usage
Note that this encrypted storage scheme means that creating a single server for each person is not necessary. In fact, doing so would be a serious security risk. If only one person is accessing a given server, and that server is publically queryable from the internet (even if the queries just return an error message), the server may be vulnerable to side-channel attacks. For example, if an attacker notices the system tends to slow down at 6:00 PM, they may deduce that the user is engaging in a large amount of internet activity at that time each day. For this reason, <b>it is strongly recommended to avoid creating a single server for each user, unless that server is restricted to their local network!</b>

## Implementation recommendations
For performance reasons, it is probably best to use the Rust programming language for this server. Remember, this is going to be involved in nearly every interaction on the internet; it absolutely, positively has to run as efficiently as possible. This is why I also recommend writing as much of the code as possible in C and calling it through Rust. C gives you access to hardware-specific optimization options, such as using the aesenc instructions available on most x86 processors, which would likely grant a massive performance boost. Don't forget that AES-GCM is parallelizable! You could easily encrypt blocks in parallel using openmp, pthreads, or similar. The importance of performance is also why I am recommending building a new database architecture, instead of building on top of an existing one. Building on an existing architecture would likely be significantly slower. Doing it this way allows for performance and storage to be optimized for this specific storage scheme.
### PUT
I forsee PUT requests being the biggest challenge of creating this server because the server cannot read the data. You could do this by simply making the database append-only, but the storage requirements would likely get out of hand. I would recommend appending the changes, and then having the agent update the information and send it back to the server when they recieve it.