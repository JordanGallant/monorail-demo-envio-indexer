/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Aggregate,
  Aggregate_Aggregation,
  Aggregate_FeeMultiplierUpdated,
  Aggregate_FeeReceiverUpdated,
  Aggregate_NativeSenderAllowlistUpdated,
  Aggregate_OwnershipTransferred,
  Aggregate_TargetAllowlistUpdated,
} from "generated";

const createOrUpdateGlobalStats = async (fields: any, context: any) => {
  let globalStats = await context.GlobalStats.get("global");

  if (!globalStats) {
    globalStats = {
      id: "global",
      feeMultiplier: BigInt(1), // assumed to be 1 if not set, should have an event emitted on initialization
      feeReceiver: "",
      owner: "",
    };
  }

  // Update only the fields that exist in the event object
  for (const key in fields) {
    if (fields[key] !== undefined && key in globalStats) {
      globalStats[key] = fields[key];
    }
  }

  await context.GlobalStats.set(globalStats);
};

Aggregate.Aggregation.handler(async ({ event, context }) => {

  let {tokenAddress, outTokenAddress, amount, destinationAmount, feeAmount} = event.params;

  const entity: Aggregate_Aggregation = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: tokenAddress,
    outTokenAddress: outTokenAddress,
    amount: amount,
    destinationAmount: destinationAmount,
    feeAmount: feeAmount,
  };

  let tokenIn = await context.Token.get(tokenAddress);
  if (tokenIn) {
    tokenIn = {
      ...tokenIn,
      tradeInAmount: tokenIn.tradeInAmount + amount,
      totalAmount: tokenIn.totalAmount + amount,
      feeAmount: tokenIn.feeAmount + feeAmount,
    };
  } else {
    tokenIn = {
      id: tokenAddress,
      tradeInAmount: amount,
      tradeOutAmount: BigInt(0),
      feeAmount: feeAmount,
      totalAmount: amount,
    };
  }

  let tokenOut = await context.Token.get(outTokenAddress);
  if (tokenOut) {
    tokenOut = {
      ...tokenOut,
      tradeOutAmount: tokenOut.tradeOutAmount + destinationAmount,
      totalAmount: tokenOut.totalAmount + destinationAmount,
      feeAmount: tokenOut.feeAmount + feeAmount,
    };
  } else {
    tokenOut = {
      id: outTokenAddress,
      tradeInAmount: BigInt(0),
      tradeOutAmount: destinationAmount,
      feeAmount: feeAmount,
      totalAmount: destinationAmount,
    };
  }

    context.Token.set(tokenIn);
    context.Token.set(tokenOut);

  context.Aggregate_Aggregation.set(entity);
});

Aggregate.FeeMultiplierUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_FeeMultiplierUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    oldFeeMultiplier: event.params.oldFeeMultiplier,
    newFeeMultiplier: event.params.newFeeMultiplier,
  };

  context.Aggregate_FeeMultiplierUpdated.set(entity);

  await createOrUpdateGlobalStats({feeMultiplier: event.params.newFeeMultiplier}, context);
});

Aggregate.FeeReceiverUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_FeeReceiverUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    oldFeeReceiver: event.params.oldFeeReceiver,
    newFeeReceiver: event.params.newFeeReceiver,
  };

  context.Aggregate_FeeReceiverUpdated.set(entity);

  await createOrUpdateGlobalStats({feeReceiver: event.params.newFeeReceiver}, context);
});

Aggregate.NativeSenderAllowlistUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_NativeSenderAllowlistUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    allowed: event.params.allowed,
  };

  context.Aggregate_NativeSenderAllowlistUpdated.set(entity);
});

Aggregate.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: Aggregate_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.Aggregate_OwnershipTransferred.set(entity);

  await createOrUpdateGlobalStats({owner: event.params.newOwner}, context);
});

Aggregate.TargetAllowlistUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_TargetAllowlistUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    target: event.params.target,
    allowed: event.params.allowed,
  };

  context.Aggregate_TargetAllowlistUpdated.set(entity);
});
