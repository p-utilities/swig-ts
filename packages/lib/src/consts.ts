import { address } from '@solana/kit';

/** Upstream Swig program id, used until `setSwigProgramAddress` points elsewhere. */
export const SWIG_PROGRAM_ADDRESS_STRING =
  'swigypWHEksbC64pWKwah1WTeh9JXwx8H1rJHLdbQMB';

let swigProgramAddress: string = SWIG_PROGRAM_ADDRESS_STRING;

/**
 * Targets every instruction and PDA this package builds at another Swig
 * deployment. Call it at startup, before anything is built: an address
 * derived earlier keeps the program id it was derived under.
 */
export function setSwigProgramAddress(programAddress: string): void {
  swigProgramAddress = address(programAddress);
}

export function getSwigProgramAddress(): string {
  return swigProgramAddress;
}

export const SYSTEM_PROGRAM_ADDRESS_STRING = '11111111111111111111111111111111';

export const TOKEN_PROGRAM_ADDRESS_STRING =
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

export const SYSVAR_RENT_ADDRESS_STRING =
  'SysvarRent111111111111111111111111111111111';

export const SUB_ACCOUNT_RENT_EXEMPT = 1224960n;
