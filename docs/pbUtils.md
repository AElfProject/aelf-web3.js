
## AElf/pbUtils
wallet module.


* [AElf/pbUtils](#module_AElf/pbUtils)
    * [arrayBufferToHex(arrayBuffer)](#exp_module_AElf/pbUtils--arrayBufferToHex) ⇒ <code>string</code> ⏏
    * [getRepForAddress(address)](#exp_module_AElf/pbUtils--getRepForAddress) ⇒ <code>string</code> ⏏
    * [getAddressFromRep(rep)](#exp_module_AElf/pbUtils--getAddressFromRep) ⇒ <code>protobuf</code> ⏏
    * [getAddressObjectFromRep(rep)](#exp_module_AElf/pbUtils--getAddressObjectFromRep) ⇒ <code>protobuf</code> ⏏
    * [getRepForHash(hash)](#exp_module_AElf/pbUtils--getRepForHash) ⇒ <code>string</code> ⏏
    * [getHashFromHex(hex)](#exp_module_AElf/pbUtils--getHashFromHex) ⇒ <code>protobuf</code> ⏏
    * [getHashObjectFromHex(hex)](#exp_module_AElf/pbUtils--getHashObjectFromHex) ⇒ <code>Object</code> ⏏
    * [encodeTransaction(tx)](#exp_module_AElf/pbUtils--encodeTransaction) ⇒ <code>protobuf</code> ⏏
    * [getTransaction(from, to, methodName, params)](#exp_module_AElf/pbUtils--getTransaction) ⇒ <code>protobuf</code> ⏏
    * [getMsigTransaction(from, to, methodName, params)](#exp_module_AElf/pbUtils--getMsigTransaction) ⇒ <code>protobuf</code> ⏏
    * [getReviewer(reviewer, to, methodName, params)](#exp_module_AElf/pbUtils--getReviewer) ⇒ <code>protobuf</code> ⏏
    * [getAuthorization(decided_threshold, proposer_threshold, reviewers)](#exp_module_AElf/pbUtils--getAuthorization) ⇒ <code>protobuf</code> ⏏
    * [getProposal(multisig_account, proposal_name, raw_txn, expired_time, proposer)](#exp_module_AElf/pbUtils--getProposal) ⇒ <code>protobuf</code> ⏏
    * [getApproval(proposalHash, signature)](#exp_module_AElf/pbUtils--getApproval) ⇒ <code>protobuf</code> ⏏
    * [getSideChainInfo(locked_token_amount, indexing_price, indexing_price, code, proposer)](#exp_module_AElf/pbUtils--getSideChainInfo) ⇒ <code>protobuf</code> ⏏
    * [getBalance(resource_balance)](#exp_module_AElf/pbUtils--getBalance) ⇒ <code>protobuf</code> ⏏
    * [encodeProposal(proposal, fieldNumber)](#exp_module_AElf/pbUtils--encodeProposal) ⇒ <code>Buffer</code> ⏏
    * [encodeSideChainInfo(sideChainInfo, fieldNumber)](#exp_module_AElf/pbUtils--encodeSideChainInfo) ⇒ <code>Buffer</code> ⏏
    * [encodeApproval(approval, fieldNumber)](#exp_module_AElf/pbUtils--encodeApproval) ⇒ <code>Buffer</code> ⏏

<a name="exp_module_AElf/pbUtils--arrayBufferToHex"></a>

### arrayBufferToHex(arrayBuffer) ⇒ <code>string</code> ⏏
arrayBuffer To Hex

**Kind**: Exported function  
**Returns**: <code>string</code> - hex string  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>Buffer</code> | arrayBuffer |

<a name="exp_module_AElf/pbUtils--getRepForAddress"></a>

### getRepForAddress(address) ⇒ <code>string</code> ⏏
get hex rep From Address

**Kind**: Exported function  
**Returns**: <code>string</code> - hex rep of address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>protobuf</code> | kernel.Address |

<a name="exp_module_AElf/pbUtils--getAddressFromRep"></a>

### getAddressFromRep(rep) ⇒ <code>protobuf</code> ⏏
get address From hex rep

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - address kernel.Address  

| Param | Type | Description |
| --- | --- | --- |
| rep | <code>string</code> | address |

<a name="exp_module_AElf/pbUtils--getAddressObjectFromRep"></a>

### getAddressObjectFromRep(rep) ⇒ <code>protobuf</code> ⏏
get address From hex rep

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - address kernel.Address  

| Param | Type | Description |
| --- | --- | --- |
| rep | <code>string</code> | address |

<a name="exp_module_AElf/pbUtils--getRepForHash"></a>

### getRepForHash(hash) ⇒ <code>string</code> ⏏
get hex rep From hash

**Kind**: Exported function  
**Returns**: <code>string</code> - hex rep  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>protobuf</code> | kernel.Hash |

<a name="exp_module_AElf/pbUtils--getHashFromHex"></a>

### getHashFromHex(hex) ⇒ <code>protobuf</code> ⏏
get Hash From Hex

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - kernel.Hash  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | string |

<a name="exp_module_AElf/pbUtils--getHashObjectFromHex"></a>

### getHashObjectFromHex(hex) ⇒ <code>Object</code> ⏏
get Hash Object From Hex

**Kind**: Exported function  
**Returns**: <code>Object</code> - kernel.Hash Hash ot Object  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | string |

<a name="exp_module_AElf/pbUtils--encodeTransaction"></a>

### encodeTransaction(tx) ⇒ <code>protobuf</code> ⏏
encode Transaction to protobuf type

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - kernel.Transaction  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>Object</code> | object |

<a name="exp_module_AElf/pbUtils--getTransaction"></a>

### getTransaction(from, to, methodName, params) ⇒ <code>protobuf</code> ⏏
get Transaction

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - kernel.Transaction  

| Param | Type |
| --- | --- |
| from | <code>string</code> | 
| to | <code>string</code> | 
| methodName | <code>string</code> | 
| params | <code>string</code> | 

<a name="exp_module_AElf/pbUtils--getMsigTransaction"></a>

### getMsigTransaction(from, to, methodName, params) ⇒ <code>protobuf</code> ⏏
get MultiSign Transaction

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - kernel.Transaction  

| Param | Type |
| --- | --- |
| from | <code>string</code> | 
| to | <code>string</code> | 
| methodName | <code>string</code> | 
| params | <code>string</code> | 

<a name="exp_module_AElf/pbUtils--getReviewer"></a>

### getReviewer(reviewer, to, methodName, params) ⇒ <code>protobuf</code> ⏏
get Reviewer

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - auth.Reviewer  

| Param | Type |
| --- | --- |
| reviewer | <code>Object</code> | 
| to | <code>string</code> | 
| methodName | <code>string</code> | 
| params | <code>string</code> | 

<a name="exp_module_AElf/pbUtils--getAuthorization"></a>

### getAuthorization(decided_threshold, proposer_threshold, reviewers) ⇒ <code>protobuf</code> ⏏
get Authorization

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - auth.Authorization  

| Param | Type |
| --- | --- |
| decided_threshold | <code>string</code> | 
| proposer_threshold | <code>string</code> | 
| reviewers | <code>string</code> | 

<a name="exp_module_AElf/pbUtils--getProposal"></a>

### getProposal(multisig_account, proposal_name, raw_txn, expired_time, proposer) ⇒ <code>protobuf</code> ⏏
get Proposal

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - auth.Proposal  

| Param | Type | Description |
| --- | --- | --- |
| multisig_account | <code>string</code> |  |
| proposal_name | <code>string</code> |  |
| raw_txn | <code>string</code> |  |
| expired_time | <code>string</code> |  |
| proposer | <code>protobuf</code> | kernel.Address |

<a name="exp_module_AElf/pbUtils--getApproval"></a>

### getApproval(proposalHash, signature) ⇒ <code>protobuf</code> ⏏
get Approval

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - auth.Approval  

| Param | Type |
| --- | --- |
| proposalHash | <code>string</code> | 
| signature | <code>string</code> | 

<a name="exp_module_AElf/pbUtils--getSideChainInfo"></a>

### getSideChainInfo(locked_token_amount, indexing_price, indexing_price, code, proposer) ⇒ <code>protobuf</code> ⏏
get Side Chain Info

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - crosschain.SideChainInfo  

| Param | Type | Description |
| --- | --- | --- |
| locked_token_amount | <code>string</code> |  |
| indexing_price | <code>string</code> |  |
| indexing_price | <code>string</code> |  |
| code | <code>string</code> |  |
| proposer | <code>string</code> | hex string |

<a name="exp_module_AElf/pbUtils--getBalance"></a>

### getBalance(resource_balance) ⇒ <code>protobuf</code> ⏏
get balance

**Kind**: Exported function  
**Returns**: <code>protobuf</code> - crosschain.ResourceTypeBalancePair  

| Param | Type |
| --- | --- |
| resource_balance | <code>object</code> | 

<a name="exp_module_AElf/pbUtils--encodeProposal"></a>

### encodeProposal(proposal, fieldNumber) ⇒ <code>Buffer</code> ⏏
encode Proposal

**Kind**: Exported function  
**Returns**: <code>Buffer</code> - buffer  

| Param | Type |
| --- | --- |
| proposal | <code>object</code> | 
| fieldNumber | <code>number</code> | 

<a name="exp_module_AElf/pbUtils--encodeSideChainInfo"></a>

### encodeSideChainInfo(sideChainInfo, fieldNumber) ⇒ <code>Buffer</code> ⏏
encode Side Chain Info

**Kind**: Exported function  
**Returns**: <code>Buffer</code> - buffer  

| Param | Type |
| --- | --- |
| sideChainInfo | <code>object</code> | 
| fieldNumber | <code>number</code> | 

<a name="exp_module_AElf/pbUtils--encodeApproval"></a>

### encodeApproval(approval, fieldNumber) ⇒ <code>Buffer</code> ⏏
encode Approval

**Kind**: Exported function  
**Returns**: <code>Buffer</code> - buffer  

| Param | Type |
| --- | --- |
| approval | <code>object</code> | 
| fieldNumber | <code>number</code> | 