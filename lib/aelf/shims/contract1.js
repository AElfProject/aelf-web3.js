/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file contract.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var protobuf = require('@aelfqueen/protobufjs');
var ContractMethod = require('./method1.js');

/**
 * Gets the service contained in the buffer which is
 * serialized FileDescriptorSet.
 * 
 * @method getService
 * @param {FileDescriptorSet} fileDescriptorSet 
 */
var getService = function (fileDescriptorSet){
    var fds = fileDescriptorSet;
    var serviceName = fds.file[fds.file.length - 1].service[0].name;
    var root = protobuf.Root.fromDescriptor(fds);
    var service = root.lookupService(serviceName);
    service.resolveAll();
    return service;
}

/**
 * Adds functions to contract object
 * @method addMethodsToContract
 * @param {Contract} contract 
 * @param {KeyPair} wallet 
 */
var addMethodsToContract = function (contract, wallet) {
    contract.service.methodsArray.map(function (method) {
        return new ContractMethod(contract._chain, method, contract.address, wallet);
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

/**
 * Creates new ContractFactory instance
 * 
 * @method ContractFactory
 * @param {Chain} chain 
 * @param {FileDescriptorSet} fileDescriptorSet 
 * @param {KeyPair} wallet 
 */
var ContractFactory = function (chain, fileDescriptorSet, wallet) {
    this.chain = chain;
    this.service = getService(fileDescriptorSet);
    this.wallet = wallet;
};

/**
 * Should be called to get access to existing contract on a blockchain
 *
 * @method at
 * @param {Address} contract address (required)
 * @param {Function} callback {optional)
 * @returns {Contract} returns contract if no callback was passed,
 * otherwise calls callback function (err, contract)
 */
ContractFactory.prototype.at = function (address, callback) {
    var contract = new Contract(this.chain, this.service, address);
    // this functions are not part of prototype,
    // because we dont want to spoil the interface
    addMethodsToContract(contract, this.wallet);

    if (callback) {
        callback(null, contract);
    }
    return contract;
};

/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @param {FileDescriptorSet} fileDescriptorSet
 * @param {Address} contract address
 */
var Contract = function (chain, service, address) {
    this._chain = chain;
    this.transactionHash = null;
    this.address = address;
    this.service = service;
};

module.exports = ContractFactory;
