import { AccId, Hash, Hex, NumberOrHex, Result, SerdeEnum, SerdeResult } from "./utils.ts";

// https://github.com/paritytech/substrate/blob/0246883/frame/contracts/rpc/src/lib.rs#L92
/// A struct that encodes RPC parameters required for a call to a smart-contract.
export interface CallRequest {
  origin: AccId;
  dest: AccId;
  value: NumberOrHex;
  gasLimit: NumberOrHex;
  storageDepositLimit: NumberOrHex | undefined;
  inputData: Hex;
}

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L50
/// Result type of a `bare_call` or `bare_instantiate` call.
///
/// It contains the execution result together with some auxiliary information.
export interface ContractResult<R> {
  /// How much gas was consumed during execution.
  gasConsumed: number;
  /// How much gas is required as gas limit in order to execute this call.
  ///
  /// This value should be used to determine the gas limit for on-chain execution.
  ///
  /// # Note
  ///
  /// This can only different from [`Self::gas_consumed`] when weight pre charging
  /// is used. Currently, only `seal_call_runtime` makes use of pre charging.
  /// Additionally, any `seal_call` or `seal_instantiate` makes use of pre-charging
  /// when a non-zero `gas_limit` argument is supplied.
  gasRequired: number;
  /// How much balance was deposited and reserved during execution in order to pay for storage.
  ///
  /// The storage deposit is never actually charged from the caller in case of [`Self::result`]
  /// is `Err`. This is because on error all storage changes are rolled back.
  storageDeposit: StorageDeposit;
  /// An optional debug message. This message is only filled when explicitly requested
  /// by the code that calls into the contract. Otherwise it is empty.
  ///
  /// The contained bytes are valid UTF-8. This is not declared as `String` because
  /// this type is not allowed within the runtime.
  ///
  /// Clients should not make any assumptions about the format of the buffer.
  /// They should just display it as-is. It is **not** only a collection of log lines
  /// provided by a contract but a formatted buffer with different sections.
  ///
  /// # Note
  ///
  /// The debug message is never generated during on-chain execution. It is reserved for
  /// RPC calls.
  debugMessage: string;
  /// The execution result of the wasm code.
  result: R;
}

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L200
/// The amount of balance that was either charged or refunded in order to pay for storage.
export type StorageDeposit = SerdeEnum<{
  /// The transaction reduced storage consumption.
  ///
  /// This means that the specified amount of balance was transferred from the involved
  /// contracts to the call origin.
  Refund: NumberOrHex;
  /// The transaction increased overall storage usage.
  ///
  /// This means that the specified amount of balance was transferred from the call origin
  /// to the contracts involved.
  Charge: NumberOrHex;
}>;

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L118
/// Flags used by a contract to customize exit behaviour.
export enum ReturnFlags {
  REVERT = 0x0000_0001,
}

/// Output of a contract call or instantiation which ran to completion.
export interface ExecReturnValue {
  /// Flags passed along by `seal_return`. Empty when `seal_return` was never called.
  flags: ReturnFlags;
  /// Buffer passed along by `seal_return`. Empty when `seal_return` was never called.
  data: Hex;
}

// https://github.com/paritytech/substrate/blob/dc22e48/primitives/runtime/src/lib.rs#L524
/** Reason why a dispatch call failed. */
export type DispatchError = SerdeEnum<{
  /// Some error occurred.
  Other: string;
  /// Failed to lookup some data.
  CannotLookup: void;
  /// A bad origin.
  BadOrigin: void;
  /// A custom error in a module.
  Module: ModuleError;
  /// At least one consumer is remaining so the account cannot be destroyed.
  ConsumerRemaining: void;
  /// There are no providers so the account cannot be created.
  NoProviders: void;
  /// There are too many consumers so the account cannot be created.
  TooManyConsumers: void;
  /// An error to do with tokens.
  Token: TokenError;
  /// An arithmetic error.
  Arithmetic: ArithmeticError;
  /// The number of transactional layers has been reached, or we are not in a transactional
  /// layer.
  Transactional: TransactionalError;
}>;

// https://github.com/paritytech/substrate/blob/dc22e48/primitives/runtime/src/lib.rs#L479
/// Reason why a pallet call failed.
export type ModuleError = {
  /// Module index, matching the metadata module index.
  index: number;
  /// Module specific error value.
  error: number;
  /// Optional error message.
  message: string | undefined;
};

// https://github.com/paritytech/substrate/blob/dc22e48/primitives/runtime/src/lib.rs#L641
/// Arithmetic errors.
export type ArithmeticError = SerdeEnum<{
  /// Underflow.
  Underflow: void;
  /// Overflow.
  Overflow: void;
  /// Division by zero.
  DivisionByZero: void;
}>;

// https://github.com/paritytech/substrate/blob/dc22e48/primitives/runtime/src/lib.rs#L601
/// Description of what went wrong when trying to complete an operation on a token.
export type TokenError = SerdeEnum<{
  /// Funds are unavailable.
  NoFunds: void;
  /// Account that must exist would die.
  WouldDie: void;
  /// Account cannot exist with the funds that would be given.
  BelowMinimum: void;
  /// Account cannot be created.
  CannotCreate: void;
  /// The asset in question is unknown.
  UnknownAsset: void;
  /// Funds exist but are frozen.
  Frozen: void;
  /// Operation is not supported by the asset.
  Unsupported: void;
}>;

// https://github.com/paritytech/substrate/blob/dc22e48/primitives/runtime/src/lib.rs#L499
/// Errors related to transactional storage layers.
export type TransactionalError = SerdeEnum<{
  /// Too many transactional layers have been spawned.
  LimitReached: void;
  /// A transactional layer was expected, but does not exist.
  NoLayer: void;
}>;

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L176
/// Reference to an existing code hash or a new wasm module
export type Code = SerdeEnum<{
  /// A wasm module as raw bytes.
  upload: Hex;
  /// The code hash of an on-chain wasm blob.
  existing: Hash;
}>;

// https://github.com/paritytech/substrate/blob/0246883/frame/contracts/rpc/src/lib.rs#L105
/// A struct that encodes RPC parameters required to instantiate a new smart-contract.
export interface InstantiateRequest {
  origin: AccId;
  value: NumberOrHex;
  gasLimit: NumberOrHex;
  storageDepositLimit: NumberOrHex | undefined;
  code: Code;
  data: Hex;
  salt: Hex;
}

// https://github.com/paritytech/substrate/blob/0246883/frame/contracts/rpc/src/lib.rs#L119
/// A struct that encodes RPC parameters required for a call to upload a new code.
export interface CodeUploadRequest {
  origin: AccId;
  code: Hex;
  storageDepositLimit: NumberOrHex | undefined;
}

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L164
/// The result of succesfully uploading a contract.
export interface CodeUploadReturnValue {
  /// The key under which the new code is stored.
  codeHash: Hash;
  /// The deposit that was reserved at the caller. Is zero when the code already existed.
  deposit: NumberOrHex;
}

// https://github.com/paritytech/substrate/blob/622f532/frame/contracts/common/src/lib.rs#L146
/// The result of a successful contract instantiation.
export interface InstantiateReturnValue {
  /// The output of the called constructor.
  result: ExecReturnValue;
  /// The account id of the new contract.
  account_id: AccId;
}

// https://github.com/paritytech/substrate/blob/0246883/frame/contracts/rpc/src/lib.rs#L127
export type ContractsRpc = {
  /// Executes a call to a contract.
  ///
  /// This call is performed locally without submitting any transactions. Thus executing this
  /// won't change any state. Nonetheless, the calling state-changing contracts is still possible.
  ///
  /// This method is useful for calling getter-like methods on contracts or to dry-run a
  /// a contract call in order to determine the `gas_limit`.
  contracts_call(
    callRequest: CallRequest,
    at?: Hash,
  ): Result<ContractResult<SerdeResult<ExecReturnValue, DispatchError>>>;
  /// Instantiate a new contract.
  ///
  /// This instantiate is performed locally without submitting any transactions. Thus the contract
  /// is not actually created.
  ///
  /// This method is useful for UIs to dry-run contract instantiations.
  contracts_instantiate(
    instantiateRequest: InstantiateRequest,
  ): Result<ContractResult<SerdeResult<InstantiateReturnValue, DispatchError>>>;
  /// Upload new code without instantiating a contract from it.
  ///
  /// This upload is performed locally without submitting any transactions. Thus executing this
  /// won't change any state.
  ///
  /// This method is useful for UIs to dry-run code upload.
  contracts_upload_code(
    uploadRequest: CodeUploadRequest,
    at?: Hash,
  ): Result<SerdeResult<CodeUploadReturnValue, DispatchError>>;
  /// Returns the value under a specified storage `key` in a contract given by `address` param,
  /// or `None` if it is not set.
  contracts_getStorage(
    accountId: AccId,
    key: Hex,
    aat?: Hash,
  ): Result<Hex | null>;
};
