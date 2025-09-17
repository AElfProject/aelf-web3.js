import React, { useState } from 'react';
import AElf from 'aelf-sdk';
import { CONFIG } from '../config';

const { sha256, arrayToHex, padLeft, padRight, decodeAddressRep, encodeAddressRep,
        toBigNumber, fromWei, toWei, base58 } = AElf.utils;

export default function UtilsComponent() {
  const [results, setResults] = useState({});
  const [inputData, setInputData] = useState({
    // Hash operations
    hashInput: 'hello world',

    // Array to hex
    arrayInput: '1,2,3,4',

    // Padding
    paddingInput: '123',
    paddingLength: '6',
    paddingChar: '0',

    // Address encoding/decoding
    addressInput: '1234567890abcdef1234567890abcdef12345678',

    // BigNumber
    bigNumberInput: '1000000000000000000',

    // Wei conversions
    weiInput: '1000000000000000000',
    weiUnit: 'ether',
    weiValue: '1',

    // Base58
    base58Input: 'hello world'
  });

  const handleInputChange = (field, value) => {
    setInputData(prev => ({ ...prev, [field]: value }));
  };

  const updateResult = (key, value) => {
    setResults(prev => ({ ...prev, [key]: value }));
  };

  // Hash Operations
  const generateSHA256 = () => {
    try {
      const hash = sha256(inputData.hashInput);
      updateResult('sha256', hash);
    } catch (error) {
      updateResult('sha256', 'Error: ' + error.message);
    }
  };

  // Array to Hex
  const convertArrayToHex = () => {
    try {
      const array = inputData.arrayInput.split(',').map(x => parseInt(x.trim()));
      const hex = arrayToHex(array);
      updateResult('arrayToHex', hex);
    } catch (error) {
      updateResult('arrayToHex', 'Error: ' + error.message);
    }
  };

  // Padding Operations
  const performPadding = () => {
    try {
      const length = parseInt(inputData.paddingLength);
      const char = inputData.paddingChar;
      const paddedLeft = padLeft(inputData.paddingInput, length, char);
      const paddedRight = padRight(inputData.paddingInput, length, char);
      updateResult('padding', {
        left: paddedLeft,
        right: paddedRight
      });
    } catch (error) {
      updateResult('padding', 'Error: ' + error.message);
    }
  };

  // Address Encoding/Decoding
  const performAddressOperations = () => {
    try {
      const encoded = encodeAddressRep(inputData.addressInput);
      const decoded = decodeAddressRep(encoded);
      updateResult('address', {
        original: inputData.addressInput,
        encoded: encoded,
        decoded: decoded,
        matches: inputData.addressInput === decoded
      });
    } catch (error) {
      updateResult('address', 'Error: ' + error.message);
    }
  };

  // BigNumber Operations
  const performBigNumberOperations = () => {
    try {
      const bigNumber = toBigNumber(inputData.bigNumberInput);
      updateResult('bigNumber', {
        input: inputData.bigNumberInput,
        toString: bigNumber.toString(),
        isBigNumber: bigNumber.constructor.name
      });
    } catch (error) {
      updateResult('bigNumber', 'Error: ' + error.message);
    }
  };

  // Wei Conversions
  const performWeiConversions = () => {
    try {
      const fromWeiResult = fromWei(inputData.weiInput, inputData.weiUnit);
      const toWeiResult = toWei(inputData.weiValue, inputData.weiUnit);
      updateResult('wei', {
        fromWei: fromWeiResult,
        toWei: toWeiResult.toString(),
        original: inputData.weiInput,
        unit: inputData.weiUnit
      });
    } catch (error) {
      updateResult('wei', 'Error: ' + error.message);
    }
  };

  // Base58 Operations
  const performBase58Operations = () => {
    try {
      const encoded = base58.encode(inputData.base58Input, 'utf-8');
      const decoded = base58.decode(encoded, 'utf-8');
      updateResult('base58', {
        original: inputData.base58Input,
        encoded: encoded,
        decoded: decoded,
        matches: inputData.base58Input === decoded
      });
    } catch (error) {
      updateResult('base58', 'Error: ' + error.message);
    }
  };

  const setDefaultValues = () => {
    setInputData({
      hashInput: 'hello world',
      arrayInput: '1,2,3,4',
      paddingInput: '123',
      paddingLength: '6',
      paddingChar: '0',
      addressInput: '1234567890abcdef1234567890abcdef12345678',
      bigNumberInput: '1000000000000000000',
      weiInput: '1000000000000000000',
      weiUnit: 'ether',
      weiValue: '1',
      base58Input: 'hello world'
    });
  };

  return (
    <div className="info-card">
      <h2>Utils Operations</h2>

      {/* Hash Operations */}
      <div className="section">
        <h3>Hash Operations</h3>
        <div className="input-group">
          <label>Input Data:</label>
          <input
            type="text"
            value={inputData.hashInput}
            onChange={(e) => handleInputChange('hashInput', e.target.value)}
            placeholder="Enter data to hash"
          />
          <button onClick={generateSHA256}>Generate SHA256</button>
        </div>

        {results.sha256 && (
          <div className="result">
            <p><strong>SHA256 Hash:</strong> {results.sha256}</p>
          </div>
        )}
      </div>

      {/* Array to Hex */}
      <div className="section">
        <h3>Array to Hex Conversion</h3>
        <div className="input-group">
          <label>Array (comma-separated):</label>
          <input
            type="text"
            value={inputData.arrayInput}
            onChange={(e) => handleInputChange('arrayInput', e.target.value)}
            placeholder="e.g., 1,2,3,4"
          />
          <button onClick={convertArrayToHex}>Convert to Hex</button>
        </div>

        {results.arrayToHex && (
          <div className="result">
            <p><strong>Hex Result:</strong> {results.arrayToHex}</p>
          </div>
        )}
      </div>

      {/* Padding Operations */}
      <div className="section">
        <h3>String Padding</h3>
        <div className="input-group">
          <label>Input String:</label>
          <input
            type="text"
            value={inputData.paddingInput}
            onChange={(e) => handleInputChange('paddingInput', e.target.value)}
            placeholder="Enter string to pad"
          />
        </div>

        <div className="input-group">
          <label>Length:</label>
          <input
            type="number"
            value={inputData.paddingLength}
            onChange={(e) => handleInputChange('paddingLength', e.target.value)}
            placeholder="Target length"
          />
        </div>

        <div className="input-group">
          <label>Padding Character:</label>
          <input
            type="text"
            value={inputData.paddingChar}
            onChange={(e) => handleInputChange('paddingChar', e.target.value)}
            placeholder="Padding character"
            maxLength="1"
          />
          <button onClick={performPadding}>Pad String</button>
        </div>

        {results.padding && (
          <div className="result">
            <p><strong>Left Padded:</strong> {results.padding.left}</p>
            <p><strong>Right Padded:</strong> {results.padding.right}</p>
          </div>
        )}
      </div>

      {/* Address Encoding/Decoding */}
      <div className="section">
        <h3>Address Encoding/Decoding</h3>
        <div className="input-group">
          <label>Hex Address:</label>
          <input
            type="text"
            value={inputData.addressInput}
            onChange={(e) => handleInputChange('addressInput', e.target.value)}
            placeholder="Enter hex address"
          />
          <button onClick={performAddressOperations}>Encode/Decode</button>
        </div>

        {results.address && (
          <div className="result">
            <p><strong>Original:</strong> {results.address.original}</p>
            <p><strong>Encoded:</strong> {results.address.encoded}</p>
            <p><strong>Decoded:</strong> {results.address.decoded}</p>
            <p className={results.address.matches ? 'success' : 'error'}>
              <strong>Matches:</strong> {results.address.matches ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>

      {/* BigNumber Operations */}
      <div className="section">
        <h3>BigNumber Operations</h3>
        <div className="input-group">
          <label>Number:</label>
          <input
            type="text"
            value={inputData.bigNumberInput}
            onChange={(e) => handleInputChange('bigNumberInput', e.target.value)}
            placeholder="Enter large number"
          />
          <button onClick={performBigNumberOperations}>Convert to BigNumber</button>
        </div>

        {results.bigNumber && (
          <div className="result">
            <p><strong>Input:</strong> {results.bigNumber.input}</p>
            <p><strong>BigNumber String:</strong> {results.bigNumber.toString}</p>
            <p><strong>Type:</strong> {results.bigNumber.isBigNumber}</p>
          </div>
        )}
      </div>

      {/* Wei Conversions */}
      <div className="section">
        <h3>Wei Conversions</h3>
        <div className="input-group">
          <label>Wei Value:</label>
          <input
            type="text"
            value={inputData.weiInput}
            onChange={(e) => handleInputChange('weiInput', e.target.value)}
            placeholder="Enter wei value"
          />
        </div>

        <div className="input-group">
          <label>Unit:</label>
          <select
            value={inputData.weiUnit}
            onChange={(e) => handleInputChange('weiUnit', e.target.value)}
          >
            <option value="wei">wei</option>
            <option value="kwei">kwei</option>
            <option value="mwei">mwei</option>
            <option value="gwei">gwei</option>
            <option value="szabo">szabo</option>
            <option value="finney">finney</option>
            <option value="ether">ether</option>
          </select>
        </div>

        <div className="input-group">
          <label>Value to Convert to Wei:</label>
          <input
            type="text"
            value={inputData.weiValue}
            onChange={(e) => handleInputChange('weiValue', e.target.value)}
            placeholder="Enter value to convert"
          />
          <button onClick={performWeiConversions}>Convert</button>
        </div>

        {results.wei && (
          <div className="result">
            <p><strong>From Wei ({results.wei.unit}):</strong> {results.wei.fromWei}</p>
            <p><strong>To Wei ({results.wei.unit}):</strong> {results.wei.toWei}</p>
            <p><strong>Original Wei:</strong> {results.wei.original}</p>
          </div>
        )}
      </div>

      {/* Base58 Operations */}
      <div className="section">
        <h3>Base58 Encoding/Decoding</h3>
        <div className="input-group">
          <label>Input Data:</label>
          <input
            type="text"
            value={inputData.base58Input}
            onChange={(e) => handleInputChange('base58Input', e.target.value)}
            placeholder="Enter data to encode"
          />
          <button onClick={performBase58Operations}>Encode/Decode</button>
        </div>

        {results.base58 && (
          <div className="result">
            <p><strong>Original:</strong> {results.base58.original}</p>
            <p><strong>Encoded:</strong> {results.base58.encoded}</p>
            <p><strong>Decoded:</strong> {results.base58.decoded}</p>
            <p className={results.base58.matches ? 'success' : 'error'}>
              <strong>Matches:</strong> {results.base58.matches ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button onClick={setDefaultValues}>Reset to Default Values</button>
          <button onClick={() => setResults({})}>Clear All Results</button>
        </div>
      </div>

      {/* Test Data */}
      <div className="section">
        <h3>Test Data</h3>
        <div className="button-group">
          <button onClick={() => handleInputChange('hashInput', CONFIG.TEST_VALUES.TEST_DATA)}>
            Set Test Hash Data
          </button>
          <button onClick={() => handleInputChange('arrayInput', '1,2,3,4,5')}>
            Set Test Array
          </button>
          <button onClick={() => handleInputChange('bigNumberInput', '1000000000000000000')}>
            Set Test BigNumber
          </button>
        </div>
      </div>
    </div>
  );
}
