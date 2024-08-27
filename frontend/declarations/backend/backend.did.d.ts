import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'playerPosition' : Position,
  'housePosition' : [] | [Position],
}
export interface Position { 'x' : number, 'y' : number }
export interface _SERVICE {
  'enterHouse' : ActorMethod<[], boolean>,
  'getGameState' : ActorMethod<[], GameState>,
  'initializeGame' : ActorMethod<[], GameState>,
  'movePlayer' : ActorMethod<[string], GameState>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
