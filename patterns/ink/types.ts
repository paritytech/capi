// export type RuntimeEvent =
//   | RuntimeEvent.Instantiated
//   | RuntimeEvent.Terminated
//   | RuntimeEvent.CodeStored
//   | RuntimeEvent.ContractEmitted
//   | RuntimeEvent.CodeRemoved
//   | RuntimeEvent.ContractCodeUpdated
//   | RuntimeEvent.Called
//   | RuntimeEvent.DelegateCalled
// export namespace RuntimeEvent {
//   /** Contract deployed by address at the specified address. */
//   export interface Instantiated {
//     type: "Instantiated"
//     deployer: Uint8Array
//     contract: Uint8Array
//   }
//   /**
//    * Contract has been removed.
//    *
//    * # Note
//    *
//    * The only way for a contract to be removed and emitting this event is by calling
//    * `seal_terminate`.
//    */
//   export interface Terminated {
//     type: "Terminated" /** The contract that was terminated. */
//     contract: Uint8Array /** The account that received the contracts remaining balance */
//     beneficiary: Uint8Array
//   }
//   /** Code with the specified hash has been stored. */
//   export interface CodeStored {
//     type: "CodeStored"
//     codeHash: Uint8Array
//   }
//   /** A custom event emitted by the contract. */
//   export interface ContractEmitted {
//     type: "ContractEmitted" /** The contract that emitted the event. */
//     contract: Uint8Array /**
//      * Data supplied by the contract. Metadata generated during contract compilation
//      * is needed to decode it.
//      */

//     data: Uint8Array
//   }
//   /** A code with the specified hash was removed. */
//   export interface CodeRemoved {
//     type: "CodeRemoved"
//     codeHash: Uint8Array
//   }
//   /** A contract's code was updated. */
//   export interface ContractCodeUpdated {
//     type: "ContractCodeUpdated" /** The contract that has been updated. */
//     contract: Uint8Array /** New code hash that was set for the contract. */
//     newCodeHash: Uint8Array /** Previous code hash of the contract. */
//     oldCodeHash: Uint8Array
//   }
//   /**
//    * A contract was called either by a plain account or another contract.
//    *
//    * # Note
//    *
//    * Please keep in mind that like all events this is only emitted for successful
//    * calls. This is because on failure all storage changes including events are
//    * rolled back.
//    */
//   export interface Called {
//     type: "Called" /** The account that called the `contract`. */
//     caller: Uint8Array /** The contract that was called. */
//     contract: Uint8Array
//   }
//   /**
//    * A contract delegate called a code hash.
//    *
//    * # Note
//    *
//    * Please keep in mind that like all events this is only emitted for successful
//    * calls. This is because on failure all storage changes including events are
//    * rolled back.
//    */
//   export interface DelegateCalled {
//     type: "DelegateCalled" /**
//      * The contract that performed the delegate call and hence in whose context
//      * the `code_hash` is executed.
//      */

//     contract: Uint8Array /** The code hash that was delegate called. */
//     codeHash: Uint8Array
//   }
// }
