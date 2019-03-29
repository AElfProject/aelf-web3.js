
## Aelf
**Kind**: global class  

* [Aelf](#Aelf)
    * [new Aelf(provider)](#new_Aelf_new)
    * _instance_
        * [.setProvider(provider)](#Aelf+setProvider)
        * [.reset(keepIsSyncing)](#Aelf+reset)
        * [.isConnected()](#Aelf+isConnected) ⇒ <code>boolean</code>
    * _static_
        * [.wallet](#Aelf.wallet)
        * [.pbjs](#Aelf.pbjs)
        * [.pbUtils](#Aelf.pbUtils)
        * [.version](#Aelf.version)

<a name="new_Aelf_new"></a>

### new Aelf(provider)
Aelf


| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Object</code> | the instance of HttpProvider |

<a name="Aelf+setProvider"></a>

### aelf.setProvider(provider)
change the provider of the instance of Aelf

**Kind**: instance method of [<code>Aelf</code>](#Aelf)  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Object</code> | the instance of HttpProvider |

<a name="Aelf+reset"></a>

### aelf.reset(keepIsSyncing)
change the provider of the instance of Aelf

**Kind**: instance method of [<code>Aelf</code>](#Aelf)  

| Param | Type | Description |
| --- | --- | --- |
| keepIsSyncing | <code>Object</code> | the instance of HttpProvider |

<a name="Aelf+isConnected"></a>

### aelf.isConnected() ⇒ <code>boolean</code>
check the rpc node is work or not

**Kind**: instance method of [<code>Aelf</code>](#Aelf)  
**Returns**: <code>boolean</code> - true/false whether can connect to the rpc.  
<a name="Aelf.wallet"></a>

### Aelf.wallet
wallet tool

**Kind**: static property of [<code>Aelf</code>](#Aelf)  
<a name="Aelf.pbjs"></a>

### Aelf.pbjs
protobufjs

**Kind**: static property of [<code>Aelf</code>](#Aelf)  
<a name="Aelf.pbUtils"></a>

### Aelf.pbUtils
some method about protobufjs of Aelf

**Kind**: static property of [<code>Aelf</code>](#Aelf)  
<a name="Aelf.version"></a>

### Aelf.version
get the verion of the SDK

**Kind**: static property of [<code>Aelf</code>](#Aelf)  