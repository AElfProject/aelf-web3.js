// 测试账号
smile believe sadness teach range walnut age pair gas gasp shoe must
0x040a221885855c22714e764f5a3de674554e


// 编译获取dll文件; 当前使用：编译Aelf.contracts.token 在项目的bin/debug中拿到AElf.Contracts.Token.dll
cd Aelf.contracts.token
dotnet publish --configuration Release -o ./(指定一个目录)
// 然后放到  /Users/huangzongzhe/.local/share/aelf/contracts 中

account unlock 0xa032679fb25873978783b39e2773a3dcc965 nolimit


connect_chain
load_contract_abi

编译拿到cli的可执行文件
dotnet build --configuration Release -o ../AElfRelease
链接到远程机器（设置rpc接口的请求地址）
dotnet AElf.CLI.dll http://35.160.211.160:8000

测试机上使用地址：a032679fb25873978783b39e2773a3dcc965
deploy_contract AElf.Contracts.Token 0 a032679fb25873978783b39e2773a3dcc965

get_tx_result c20bbee4b008cbcc334a851f806e7ce072a089ad162d251f9046a52c4b0f553f
contract_address: 1c963db74dac6fefaf09eed570e282a540d7
load_contract_abi 1c963db74dac6fefaf09eed570e282a540d7

broadcast_tx {"from":"a032679fb25873978783b39e2773a3dcc965","to":"1c963db74dac6fefaf09eed570e282a540d7","method":"Initialize","incr":"0","params":["s","ELF","250250250","10"]}
broadcast_tx {"from":"a032679fb25873978783b39e2773a3dcc965","to":"1c963db74dac6fefaf09eed570e282a540d7","method":"Transfer","incr":"0","params":["94e30949a4eeb03aad91183833f0bfb8c62f",250250]}

broadcast_tx {"from":"0x045a01b28c73e233e7b6c029c83869daca2c","to":"0x3dc5f6254c056a2210fec89aad3afa31ae5d","method":"Initialize","incr":"1","params":["s","ELF",10000,10]}
call {"from":"0x045a01b28c73e233e7b6c029c83869daca2c","to":"0x3dc5f6254c056a2210fec89aad3afa31ae5d","method":"TotalSupply","incr":"0"}
broadcast_tx {"from":"0x045a01b28c73e233e7b6c029c83869daca2c","to":"0x3dc5f6254c056a2210fec89aad3afa31ae5d","method":"Transfer","incr":"2","params":["0x045f4f96e2c9345dd98de77b1ddca6ca599a",9000]}
call {"from":"0x045a01b28c73e233e7b6c029c83869daca2c","to":"0x3dc5f6254c056a2210fec89aad3afa31ae5d","method":"BalanceOf","incr":"0","params":["0x040d68ec9286583d495a04196def02004a07"]}

本地开发：
deploy_contract AElf.Contracts.Token 0 0xa032679fb25873978783b39e2773a3dcc965

// get_tx_result 0x0772f7be3ba92653114322c851c42281cd3c1b227d903b3732db16ae919766c5
get_tx_result 75e9a009f3361c8edb815af687e768540d1198e604217980e998646cb7d44c49
// return你的合约地址 比如这次是：0x04bc114e7ea1fab9638055f938355d2d92592fe7c8511db8ddd5c4575d26c1af
load_contract_abi 30748a6c59c1309eacd1eaf86feb3ea16074

// broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"Initialize","incr":"1","params":["s","ELF","25000","10"]}
broadcast_tx {"from":"0xa032679fb25873978783b39e2773a3dcc965","to":"30748a6c59c1309eacd1eaf86feb3ea16074","method":"Initialize","incr":"0","params":["s","ELF","250250250","10"]}
// txid: 0xb8f640a2b707aad2001f8787b74c36cfcc48d09627fddc40e6b7f5053ddc24bc

// 0x167257973f84576ef759c9c2db60840ae07fb7e52b4d016006d22f323844d9d3    increment: 3

// 不需要发交易的，直接用call就好了
call {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"TotalSupply","incr":"0"}
call {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"TokenName","incr":"0"}
broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"TotalSupply","incr":"0"}

call {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"BalanceOf","incr":"0","params":["0x040a221885855c22714e764f5a3de674554e"]}
call {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"BalanceOf","incr":"0","params":["0x0489da3cad42c556cddf672d6719c8add3ac"]}
// broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x9094cd817b990d6d642ad282912f430311bc","method":"BalanceOf","incr":"2","params":["0x0489da3cad42c556cddf672d6719c8add3ac"]}
broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"BalanceOf","incr":"0","params":["0x040a221885855c22714e764f5a3de674554e"]}
broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"BalanceOf","incr":"0","params":["0x0489da3cad42c556cddf672d6719c8add3ac"]}

// broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x9094cd817b990d6d642ad282912f430311bc","method":"BalanceOf","incr":"22","params":["0x0459fc440b7f54f3a25a1a3039394d733150"]}
// txid: 0x7f96442d6c74ad14ec6d91c27eb947a80e24c12ffedd6dd019e0a49c5762726f

Transfer:
// broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"Transfer","incr":"2","params":["0x040a221885855c22714e764f5a3de674554e",2000]}
broadcast_tx {"from":"0xa032679fb25873978783b39e2773a3dcc965","to":"30748a6c59c1309eacd1eaf86feb3ea16074","method":"Transfer","incr":"0","params":["0x8040cff1793c2161834b3b35f05591fc3ae8",2000]}
broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"Transfer","incr":"0","params":["0x040a221885855c22714e764f5a3de674554e",10]}
// broadcast_tx {"from":"0x047cc403b45e487dd502186e1a66e46a2328","to":"0x9094cd817b990d6d642ad282912f430311bc","method":"Transfer","incr":"0","params":["0x0489da3cad42c556cddf672d6719c8add3ac",5]}
broadcast_tx {"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0xfe9f895a9f425c4ec3dc5c54bfce9908f03b","method":"Transfer","incr":"12","params":["0x040a221885855c22714e764f5a3de674554e",5]}
// 不需要交易的使用call方法