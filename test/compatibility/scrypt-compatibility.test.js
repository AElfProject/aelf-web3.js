/**
 * @file Scrypt compatibility tests
 * @description Tests to verify compatibility between scryptsy and scrypt-js
 *              This ensures that both implementations produce identical results
 */

import { describe, it, expect } from 'vitest';
import scryptsy from 'scryptsy';
import { syncScrypt } from 'scrypt-js';

describe('Scrypt Compatibility Tests', () => {
  // Test parameters (same as used in keyStore.js)
  const testPassword = 'test password';
  const testSalt = Buffer.from('1234567890abcdef1234567890abcdef12345678', 'hex'); // 32 bytes
  const N = 8192;  // CPU/memory cost parameter
  const r = 8;     // Block size parameter  
  const p = 1;     // Parallelization parameter
  const dklen = 32; // Desired key length

  it('should produce identical results with same parameters', () => {
    // Test scryptsy (synchronous)
    const scryptsyResult = scryptsy(Buffer.from(testPassword, 'utf8'), testSalt, N, r, p, dklen);
    
    // Test scrypt-js (synchronous)
    const scryptjsResult = syncScrypt(Buffer.from(testPassword, 'utf8'), testSalt, N, r, p, dklen);
    const scryptjsBuffer = Buffer.from(scryptjsResult);
    
    // Results should be identical
    expect(scryptsyResult.toString('hex')).toBe(scryptjsBuffer.toString('hex'));
    expect(scryptsyResult.length).toBe(scryptjsBuffer.length);
    expect(scryptsyResult.length).toBe(dklen);
  });

  it('should produce identical results with multiple different salts', () => {
    for (let i = 0; i < 5; i++) {
      const randomSalt = Buffer.alloc(32);
      randomSalt.fill(i);
      
      const scryptsyRes = scryptsy(Buffer.from(testPassword, 'utf8'), randomSalt, N, r, p, dklen);
      const scryptjsRes = Buffer.from(syncScrypt(Buffer.from(testPassword, 'utf8'), randomSalt, N, r, p, dklen));
      
      expect(scryptsyRes.toString('hex')).toBe(scryptjsRes.toString('hex'));
      expect(scryptsyRes.length).toBe(dklen);
    }
  });

  it('should produce identical results with different passwords', () => {
    const passwords = [
      'simple password',
      'complex password with special chars !@#$%^&*()',
      '中文密码',
      'password with spaces and numbers 123',
      ''
    ];

    for (const password of passwords) {
      const scryptsyRes = scryptsy(Buffer.from(password, 'utf8'), testSalt, N, r, p, dklen);
      const scryptjsRes = Buffer.from(syncScrypt(Buffer.from(password, 'utf8'), testSalt, N, r, p, dklen));
      
      expect(scryptsyRes.toString('hex')).toBe(scryptjsRes.toString('hex'));
      expect(scryptsyRes.length).toBe(dklen);
    }
  });

  it('should produce identical results with different scrypt parameters', () => {
    const testCases = [
      { N: 1024, r: 8, p: 1 },
      { N: 2048, r: 8, p: 1 },
      { N: 4096, r: 8, p: 1 },
      { N: 8192, r: 4, p: 1 },
      { N: 8192, r: 8, p: 2 }
    ];

    for (const params of testCases) {
      const scryptsyRes = scryptsy(Buffer.from(testPassword, 'utf8'), testSalt, params.N, params.r, params.p, dklen);
      const scryptjsRes = Buffer.from(syncScrypt(Buffer.from(testPassword, 'utf8'), testSalt, params.N, params.r, params.p, dklen));
      
      expect(scryptsyRes.toString('hex')).toBe(scryptjsRes.toString('hex'));
      expect(scryptsyRes.length).toBe(dklen);
    }
  });

  it('should produce identical results with different key lengths', () => {
    const keyLengths = [16, 24, 32, 48, 64];

    for (const length of keyLengths) {
      const scryptsyRes = scryptsy(Buffer.from(testPassword, 'utf8'), testSalt, N, r, p, length);
      const scryptjsRes = Buffer.from(syncScrypt(Buffer.from(testPassword, 'utf8'), testSalt, N, r, p, length));
      
      expect(scryptsyRes.toString('hex')).toBe(scryptjsRes.toString('hex'));
      expect(scryptsyRes.length).toBe(length);
    }
  });
});
