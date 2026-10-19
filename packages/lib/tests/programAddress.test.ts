import {
  address,
  getBytesEncoder,
  getProgramDerivedAddress,
  getUtf8Encoder,
} from '@solana/kit';
import { afterEach, describe, expect, test } from 'bun:test';
import {
  findSwigPdaRaw,
  findSwigSystemAddressPdaRaw,
  getSwigProgramAddress,
  setSwigProgramAddress,
  SWIG_PROGRAM_ADDRESS_STRING,
  swigInstruction,
} from '../src';

const OTHER_PROGRAM = 'BPFLoaderUpgradeab1e11111111111111111111111';
const ID = new Uint8Array(32).fill(7);

describe('setSwigProgramAddress', () => {
  afterEach(() => setSwigProgramAddress(SWIG_PROGRAM_ADDRESS_STRING));

  test('defaults to the upstream program', () => {
    expect(getSwigProgramAddress()).toBe(SWIG_PROGRAM_ADDRESS_STRING);
  });

  test('derives PDAs and builds instructions under the configured program', async () => {
    setSwigProgramAddress(OTHER_PROGRAM);

    const [expectedSwig, expectedBump] = await getProgramDerivedAddress({
      programAddress: address(OTHER_PROGRAM),
      seeds: [getUtf8Encoder().encode('swig'), getBytesEncoder().encode(ID)],
    });
    const [swig, bump] = await findSwigPdaRaw(ID);
    expect(swig.toBase58()).toBe(expectedSwig);
    expect(bump).toBe(expectedBump);

    const [expectedWallet] = await getProgramDerivedAddress({
      programAddress: address(OTHER_PROGRAM),
      seeds: [
        getUtf8Encoder().encode('swig-wallet-address'),
        getBytesEncoder().encode(swig.toBytes()),
      ],
    });
    const [wallet] = await findSwigSystemAddressPdaRaw(swig);
    expect(wallet.toBase58()).toBe(expectedWallet);

    const ix = swigInstruction([], new Uint8Array([1]));
    expect(ix.program.toBase58()).toBe(OTHER_PROGRAM);
  });

  test('rejects an invalid address and keeps the previous one', () => {
    expect(() => setSwigProgramAddress('not-a-pubkey')).toThrow();
    expect(getSwigProgramAddress()).toBe(SWIG_PROGRAM_ADDRESS_STRING);
  });
});
