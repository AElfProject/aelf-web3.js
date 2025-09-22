/**
 * @file bs58 compatibility tests
 * @description Tests to verify compatibility between bs58 and @scure/base
 *              This ensures that both implementations produce identical results
 */

import { describe, it, expect } from 'vitest';
import bs58 from 'bs58';
import { base58 as scureBase58 } from '@scure/base';

describe('bs58 Compatibility Tests', () => {
  // Test data - various types of input
  const testCases = [
    {
      name: 'simple hex string',
      input: '48656c6c6f20576f726c64', // "Hello World" in hex
      encoding: 'hex'
    },
    {
      name: 'empty buffer',
      input: '',
      encoding: 'hex'
    },
    {
      name: 'single byte',
      input: 'ff',
      encoding: 'hex'
    },
    {
      name: '32 bytes (typical hash)',
      input: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      encoding: 'hex'
    },
    {
      name: 'address-like data (33 bytes)',
      input: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
      encoding: 'hex'
    },
    {
      name: 'chain ID data (3 bytes)',
      input: '123456',
      encoding: 'hex'
    }
  ];

  describe('Direct encoding/decoding compatibility', () => {
    testCases.forEach(({ name, input, encoding }) => {
      it(`should produce identical results for ${name}`, () => {
        const buffer = Buffer.from(input, encoding);
        
        // Test bs58
        const bs58Encoded = bs58.encode(buffer);
        const bs58Decoded = bs58.decode(bs58Encoded);
        
        // Test @scure/base with Uint8Array
        const uint8Array = new Uint8Array(buffer);
        const scureEncoded = scureBase58.encode(uint8Array);
        const scureDecoded = scureBase58.decode(scureEncoded);
        
        // Results should be identical
        expect(scureEncoded).toBe(bs58Encoded);
        expect(Buffer.from(scureDecoded).toString('hex')).toBe(Buffer.from(bs58Decoded).toString('hex'));
      });
    });
  });

  describe('Buffer vs Uint8Array conversion', () => {
    it('should handle Buffer to Uint8Array conversion correctly', () => {
      const testData = '48656c6c6f20576f726c64';
      const buffer = Buffer.from(testData, 'hex');
      const uint8Array = new Uint8Array(buffer);
      
      // Both should produce same result
      const bs58Result = bs58.encode(buffer);
      const scureResult = scureBase58.encode(uint8Array);
      
      expect(scureResult).toBe(bs58Result);
    });

    it('should handle Uint8Array to Buffer conversion correctly', () => {
      const testData = '48656c6c6f20576f726c64';
      const uint8Array = new Uint8Array(Buffer.from(testData, 'hex'));
      
      const encoded = scureBase58.encode(uint8Array);
      const decoded = scureBase58.decode(encoded);
      
      // Convert back to Buffer for comparison
      const buffer = Buffer.from(decoded);
      expect(buffer.toString('hex')).toBe(testData);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero bytes correctly', () => {
      const zeroBuffer = Buffer.alloc(10, 0);
      const zeroUint8Array = new Uint8Array(zeroBuffer);
      
      const bs58Result = bs58.encode(zeroBuffer);
      const scureResult = scureBase58.encode(zeroUint8Array);
      
      expect(scureResult).toBe(bs58Result);
    });

    it('should handle maximum byte values correctly', () => {
      const maxBuffer = Buffer.alloc(10, 0xff);
      const maxUint8Array = new Uint8Array(maxBuffer);
      
      const bs58Result = bs58.encode(maxBuffer);
      const scureResult = scureBase58.encode(maxUint8Array);
      
      expect(scureResult).toBe(bs58Result);
    });

    it('should handle mixed byte values correctly', () => {
      const mixedBuffer = Buffer.from([0x00, 0xff, 0x7f, 0x80, 0x01, 0xfe]);
      const mixedUint8Array = new Uint8Array(mixedBuffer);
      
      const bs58Result = bs58.encode(mixedBuffer);
      const scureResult = scureBase58.encode(mixedUint8Array);
      
      expect(scureResult).toBe(bs58Result);
    });
  });

  describe('Round-trip compatibility', () => {
    testCases.forEach(({ name, input, encoding }) => {
      it(`should maintain data integrity through round-trip for ${name}`, () => {
        const originalBuffer = Buffer.from(input, encoding);
        const originalUint8Array = new Uint8Array(originalBuffer);
        
        // Encode with @scure/base
        const encoded = scureBase58.encode(originalUint8Array);
        
        // Decode with @scure/base
        const decoded = scureBase58.decode(encoded);
        const resultBuffer = Buffer.from(decoded);
        
        // Should match original
        expect(resultBuffer.toString('hex')).toBe(originalBuffer.toString('hex'));
      });
    });
  });

  describe('Error handling compatibility', () => {
    it('should handle invalid base58 strings similarly', () => {
      const invalidStrings = [
        '0', // contains invalid character
        'O', // contains invalid character  
        'I', // contains invalid character
        'l', // contains invalid character
        'invalid!@#', // contains invalid characters
      ];

      invalidStrings.forEach(invalidStr => {
        expect(() => bs58.decode(invalidStr)).toThrow();
        expect(() => scureBase58.decode(invalidStr)).toThrow();
      });
    });

    it('should handle empty string consistently', () => {
      // Empty string might be handled differently by different libraries
      const emptyStr = '';
      
      // Test if both throw or both don't throw
      let bs58Throws = false;
      let scureThrows = false;
      
      try {
        bs58.decode(emptyStr);
      } catch (e) {
        bs58Throws = true;
      }
      
      try {
        scureBase58.decode(emptyStr);
      } catch (e) {
        scureThrows = true;
      }
      
      // Both should behave the same way
      expect(bs58Throws).toBe(scureThrows);
    });
  });
});
