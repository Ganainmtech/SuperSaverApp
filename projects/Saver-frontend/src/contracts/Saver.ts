/* eslint-disable */
// @ts-nocheck
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  ABIAppCallArg,
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  AppCompilationResult,
  AppReference,
  AppState,
  AppStorageSchema,
  CoreAppCallArgs,
  RawAppCallArgs,
  TealTemplateParams,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom, SendTransactionParams } from '@algorandfoundation/algokit-utils/types/transaction'
import type { ABIResult, TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer, modelsv2 } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "create_saver_jar(uint64)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "deposit(pay)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "withdraw()void": {
      "call_config": {
        "no_op": "CALL"
      }
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpzbWFydF9jb250cmFjdHMuc2F2ZXJfY29udHJhY3QuY29udHJhY3QuU2F2ZXIuYXBwcm92YWxfcHJvZ3JhbToKICAgIGludGNibG9jayAwIDEKICAgIGJ5dGVjYmxvY2sgInVzZXJfYmFsYW5jZSIgInVzZXJfZ29hbCIKICAgIGNhbGxzdWIgX19wdXlhX2FyYzRfcm91dGVyX18KICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy5zYXZlcl9jb250cmFjdC5jb250cmFjdC5TYXZlci5fX3B1eWFfYXJjNF9yb3V0ZXJfXygpIC0+IHVpbnQ2NDoKX19wdXlhX2FyYzRfcm91dGVyX186CiAgICBwcm90byAwIDEKICAgIHR4biBOdW1BcHBBcmdzCiAgICBieiBfX3B1eWFfYXJjNF9yb3V0ZXJfX19iYXJlX3JvdXRpbmdANwogICAgcHVzaGJ5dGVzcyAweDY3ZjEyNTVkIDB4MzYyNWU0ZWIgMHhiNzM1NWZkMSAvLyBtZXRob2QgImNyZWF0ZV9zYXZlcl9qYXIodWludDY0KXZvaWQiLCBtZXRob2QgImRlcG9zaXQocGF5KXZvaWQiLCBtZXRob2QgIndpdGhkcmF3KCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggX19wdXlhX2FyYzRfcm91dGVyX19fY3JlYXRlX3NhdmVyX2phcl9yb3V0ZUAyIF9fcHV5YV9hcmM0X3JvdXRlcl9fX2RlcG9zaXRfcm91dGVAMyBfX3B1eWFfYXJjNF9yb3V0ZXJfX193aXRoZHJhd19yb3V0ZUA0CiAgICBpbnRjXzAgLy8gMAogICAgcmV0c3ViCgpfX3B1eWFfYXJjNF9yb3V0ZXJfX19jcmVhdGVfc2F2ZXJfamFyX3JvdXRlQDI6CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gaXMgbm90IGNyZWF0aW5nCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBidG9pCiAgICBjYWxsc3ViIGNyZWF0ZV9zYXZlcl9qYXIKICAgIGludGNfMSAvLyAxCiAgICByZXRzdWIKCl9fcHV5YV9hcmM0X3JvdXRlcl9fX2RlcG9zaXRfcm91dGVAMzoKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBpcyBub3QgY3JlYXRpbmcKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgY2FsbHN1YiBkZXBvc2l0CiAgICBpbnRjXzEgLy8gMQogICAgcmV0c3ViCgpfX3B1eWFfYXJjNF9yb3V0ZXJfX193aXRoZHJhd19yb3V0ZUA0OgogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGlzIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiB3aXRoZHJhdwogICAgaW50Y18xIC8vIDEKICAgIHJldHN1YgoKX19wdXlhX2FyYzRfcm91dGVyX19fYmFyZV9yb3V0aW5nQDc6CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICBzd2l0Y2ggX19wdXlhX2FyYzRfcm91dGVyX19fX19hbGdvcHlfZGVmYXVsdF9jcmVhdGVAOSBfX3B1eWFfYXJjNF9yb3V0ZXJfX19PcHRJbkA4CiAgICBpbnRjXzAgLy8gMAogICAgcmV0c3ViCgpfX3B1eWFfYXJjNF9yb3V0ZXJfX19PcHRJbkA4OgogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBpcyBub3QgY3JlYXRpbmcKICAgIGNhbGxzdWIgT3B0SW4KICAgIGludGNfMSAvLyAxCiAgICByZXRzdWIKCl9fcHV5YV9hcmM0X3JvdXRlcl9fX19fYWxnb3B5X2RlZmF1bHRfY3JlYXRlQDk6CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgYXNzZXJ0IC8vIGlzIGNyZWF0aW5nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnNhdmVyX2NvbnRyYWN0LmNvbnRyYWN0LlNhdmVyLmNyZWF0ZV9zYXZlcl9qYXIoZ29hbF9hbW91bnQ6IHVpbnQ2NCkgLT4gdm9pZDoKY3JlYXRlX3NhdmVyX2phcjoKICAgIHByb3RvIDEgMAogICAgdHhuIFNlbmRlcgogICAgYnl0ZWNfMSAvLyAidXNlcl9nb2FsIgogICAgZnJhbWVfZGlnIC0xCiAgICBhcHBfbG9jYWxfcHV0CiAgICB0eG4gU2VuZGVyCiAgICBieXRlY18wIC8vICJ1c2VyX2JhbGFuY2UiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2xvY2FsX3B1dAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnNhdmVyX2NvbnRyYWN0LmNvbnRyYWN0LlNhdmVyLmRlcG9zaXQoZGVwb3NpdF90eG46IHVpbnQ2NCkgLT4gdm9pZDoKZGVwb3NpdDoKICAgIHByb3RvIDEgMAogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBSZWNlaXZlcgogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICBhc3NlcnQKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJ1c2VyX2JhbGFuY2UiCiAgICBhcHBfbG9jYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2VyX2JhbGFuY2UgZXhpc3RzIGZvciBhY2NvdW50CiAgICBmcmFtZV9kaWcgLTEKICAgIGd0eG5zIEFtb3VudAogICAgdHhuIFNlbmRlcgogICAgY292ZXIgMgogICAgKwogICAgYnl0ZWNfMCAvLyAidXNlcl9iYWxhbmNlIgogICAgc3dhcAogICAgYXBwX2xvY2FsX3B1dAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnNhdmVyX2NvbnRyYWN0LmNvbnRyYWN0LlNhdmVyLndpdGhkcmF3KCkgLT4gdm9pZDoKd2l0aGRyYXc6CiAgICBwcm90byAwIDAKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJ1c2VyX2dvYWwiCiAgICBhcHBfbG9jYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2VyX2dvYWwgZXhpc3RzIGZvciBhY2NvdW50CiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidXNlcl9iYWxhbmNlIgogICAgYXBwX2xvY2FsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYudXNlcl9iYWxhbmNlIGV4aXN0cyBmb3IgYWNjb3VudAogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgID49CiAgICBhc3NlcnQKICAgIGl0eG5fYmVnaW4KICAgIHR4biBTZW5kZXIKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpbnRjXzEgLy8gcGF5CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICB0eG4gU2VuZGVyCiAgICBieXRlY18wIC8vICJ1c2VyX2JhbGFuY2UiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2xvY2FsX3B1dAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnNhdmVyX2NvbnRyYWN0LmNvbnRyYWN0LlNhdmVyLk9wdEluKCkgLT4gdm9pZDoKT3B0SW46CiAgICBwcm90byAwIDAKICAgIHR4biBTZW5kZXIKICAgIGJ5dGVjXzEgLy8gInVzZXJfZ29hbCIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfbG9jYWxfcHV0CiAgICB0eG4gU2VuZGVyCiAgICBieXRlY18wIC8vICJ1c2VyX2JhbGFuY2UiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2xvY2FsX3B1dAogICAgcmV0c3ViCg==",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDEwCgpzbWFydF9jb250cmFjdHMuc2F2ZXJfY29udHJhY3QuY29udHJhY3QuU2F2ZXIuY2xlYXJfc3RhdGVfcHJvZ3JhbToKICAgIHB1c2hpbnQgMSAvLyAxCiAgICByZXR1cm4K"
  },
  "state": {
    "global": {
      "num_byte_slices": 0,
      "num_uints": 0
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 2
    }
  },
  "schema": {
    "global": {
      "declared": {},
      "reserved": {}
    },
    "local": {
      "declared": {
        "user_balance": {
          "type": "uint64",
          "key": "user_balance",
          "descr": "User's savings balance"
        },
        "user_goal": {
          "type": "uint64",
          "key": "user_goal",
          "descr": "User's savings goal"
        }
      },
      "reserved": {}
    }
  },
  "contract": {
    "name": "Saver",
    "methods": [
      {
        "name": "create_saver_jar",
        "args": [
          {
            "type": "uint64",
            "name": "goal_amount"
          }
        ],
        "readonly": false,
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "deposit",
        "args": [
          {
            "type": "pay",
            "name": "deposit_txn"
          }
        ],
        "readonly": false,
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "withdraw",
        "args": [],
        "readonly": false,
        "returns": {
          "type": "void"
        }
      }
    ],
    "networks": {}
  },
  "bare_call_config": {
    "opt_in": "CALL",
    "no_op": "CREATE"
  }
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt.
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

export type AppCreateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult> & AppReference
export type AppUpdateCallTransactionResult = AppCallTransactionResult & Partial<AppCompilationResult>

export type AppClientComposeCallCoreParams = Omit<AppClientCallCoreParams, 'sendParams'> & {
  sendParams?: Omit<SendTransactionParams, 'skipSending' | 'atc' | 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources'>
}
export type AppClientComposeExecuteParams = Pick<SendTransactionParams, 'skipWaiting' | 'maxRoundsToWaitForConfirmation' | 'populateAppCallResources' | 'suppressLog'>

export type IncludeSchema = {
  /**
   * Any overrides for the storage schema to request for the created app; by default the schema indicated by the app spec is used.
   */
  schema?: Partial<AppStorageSchema>
}

/**
 * Defines the types of available calls and state of the Saver smart contract.
 */
export type Saver = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'create_saver_jar(uint64)void' | 'create_saver_jar', {
      argsObj: {
        goalAmount: bigint | number
      }
      argsTuple: [goalAmount: bigint | number]
      returns: void
    }>
    & Record<'deposit(pay)void' | 'deposit', {
      argsObj: {
        depositTxn: TransactionToSign | Transaction | Promise<SendTransactionResult>
      }
      argsTuple: [depositTxn: TransactionToSign | Transaction | Promise<SendTransactionResult>]
      returns: void
    }>
    & Record<'withdraw()void' | 'withdraw', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    local: {
      /**
       * User's savings balance
       */
      userBalance?: IntegerState
      /**
       * User's savings goal
       */
      userGoal?: IntegerState
    }
  }
}
/**
 * Defines the possible abi call signatures
 */
export type SaverSig = keyof Saver['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends SaverSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the Saver smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends SaverSig> = Saver['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the Saver smart contract to the method's return type
 */
export type MethodReturn<TSignature extends SaverSig> = Saver['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type SaverCreateCalls = (typeof SaverCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type SaverCreateCallParams =
  | (TypedCallParams<undefined> & (OnCompleteNoOp))
/**
 * Defines arguments required for the deploy method.
 */
export type SaverDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: SaverCreateCalls) => SaverCreateCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class SaverCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the Saver smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available optIn call factories
   */
  static get optIn() {
    return {
      /**
       * Constructs an opt in call for the Saver smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the create_saver_jar(uint64)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static createSaverJar(args: MethodArgs<'create_saver_jar(uint64)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'create_saver_jar(uint64)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.goalAmount],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the deposit(pay)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static deposit(args: MethodArgs<'deposit(pay)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'deposit(pay)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.depositTxn],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the withdraw()void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static withdraw(args: MethodArgs<'withdraw()void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'withdraw()void' as const,
      methodArgs: Array.isArray(args) ? args : [],
      ...params,
    }
  }
}

/**
 * A client to make calls to the Saver smart contract
 */
export class SaverClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `SaverClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn, TResult extends AppCallTransactionResult = AppCallTransactionResult>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> & TResult {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue } as AppCallTransactionResultOfType<TReturn> & TResult
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof Saver['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the Saver smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: SaverDeployArgs & AppClientDeployCoreParams & IncludeSchema = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(SaverCallFactory.create)
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the Saver smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      async bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & IncludeSchema & CoreAppCallArgs & (OnCompleteNoOp) = {}) {
        return $this.mapReturnValue<undefined, AppCreateCallTransactionResult>(await $this.appClient.create(args))
      },
    }
  }

  /**
   * Gets available optIn methods
   */
  public get optIn() {
    const $this = this
    return {
      /**
       * Opts the user into an existing instance of the Saver smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The optIn result
       */
      async bare(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return $this.mapReturnValue<undefined>(await $this.appClient.optIn(args))
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the Saver smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the create_saver_jar(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public createSaverJar(args: MethodArgs<'create_saver_jar(uint64)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(SaverCallFactory.createSaverJar(args, params))
  }

  /**
   * Calls the deposit(pay)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public deposit(args: MethodArgs<'deposit(pay)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(SaverCallFactory.deposit(args, params))
  }

  /**
   * Calls the withdraw()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public withdraw(args: MethodArgs<'withdraw()void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(SaverCallFactory.withdraw(args, params))
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(state: AppState, key: string): BinaryState | undefined {
    const value = state[key]
    if (!value) return undefined
    if (!('valueRaw' in value))
      throw new Error(`Failed to parse state value for ${key}; received an int when expected a byte array`)
    return {
      asString(): string {
        return value.value
      },
      asByteArray(): Uint8Array {
        return value.valueRaw
      }
    }
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(state: AppState, key: string): IntegerState | undefined {
    const value = state[key]
    if (!value) return undefined
    if ('valueRaw' in value)
      throw new Error(`Failed to parse state value for ${key}; received a byte array when expected a number`)
    return {
      asBigInt() {
        return typeof value.value === 'bigint' ? value.value : BigInt(value.value)
      },
      asNumber(): number {
        return typeof value.value === 'bigint' ? Number(value.value) : value.value
      },
    }
  }

  /**
   * Returns the smart contract's local state wrapped in a strongly typed accessor with options to format the stored value
   *
   * @param account The address of the account for which to read local state from
   */
  public async getLocalState(account: string | SendTransactionFrom): Promise<Saver['state']['local']> {
    const state = await this.appClient.getLocalState(account)
    return {
      get userBalance() {
        return SaverClient.getIntegerState(state, 'user_balance')
      },
      get userGoal() {
        return SaverClient.getIntegerState(state, 'user_goal')
      },
    }
  }

  public compose(): SaverComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      createSaverJar(args: MethodArgs<'create_saver_jar(uint64)void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.createSaverJar(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      deposit(args: MethodArgs<'deposit(pay)void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.deposit(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      withdraw(args: MethodArgs<'withdraw()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.withdraw(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      get optIn() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() => client.optIn.bare({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async simulate(options?: SimulateOptions) {
        await promiseChain
        const result = await atc.simulate(client.algod, new modelsv2.SimulateRequest({ txnGroups: [], ...options }))
        return {
          ...result,
          returns: result.methodResults?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      },
      async execute(sendParams?: AppClientComposeExecuteParams) {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as SaverComposer
  }
}
export type SaverComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the create_saver_jar(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  createSaverJar(args: MethodArgs<'create_saver_jar(uint64)void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): SaverComposer<[...TReturns, MethodReturn<'create_saver_jar(uint64)void'>]>

  /**
   * Calls the deposit(pay)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  deposit(args: MethodArgs<'deposit(pay)void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): SaverComposer<[...TReturns, MethodReturn<'deposit(pay)void'>]>

  /**
   * Calls the withdraw()void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  withdraw(args: MethodArgs<'withdraw()void'>, params?: AppClientComposeCallCoreParams & CoreAppCallArgs): SaverComposer<[...TReturns, MethodReturn<'withdraw()void'>]>

  /**
   * Gets available optIn methods
   */
  readonly optIn: {
    /**
     * Opts the user into an existing instance of the Saver smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs): SaverComposer<[...TReturns, undefined]>
  }

  /**
   * Makes a clear_state call to an existing instance of the Saver smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientComposeCallCoreParams & CoreAppCallArgs): SaverComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): SaverComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(options?: SimulateOptions): Promise<SaverComposerSimulateResult<TReturns>>
  /**
   * Executes the transaction group and returns the results
   */
  execute(sendParams?: AppClientComposeExecuteParams): Promise<SaverComposerResults<TReturns>>
}
export type SimulateOptions = Omit<ConstructorParameters<typeof modelsv2.SimulateRequest>[0], 'txnGroups'>
export type SaverComposerSimulateResult<TReturns extends [...any[]]> = {
  returns: TReturns
  methodResults: ABIResult[]
  simulateResponse: modelsv2.SimulateResponse
}
export type SaverComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}