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

Aggregate.Aggregation.handler(async ({ event, context }) => {
  const entity: Aggregate_Aggregation = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.params.tokenAddress,
    outTokenAddress: event.params.outTokenAddress,
    amount: event.params.amount,
    destinationAmount: event.params.destinationAmount,
    feeAmount: event.params.feeAmount,
  };

  context.Aggregate_Aggregation.set(entity);
});

Aggregate.FeeMultiplierUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_FeeMultiplierUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    oldFeeMultiplier: event.params.oldFeeMultiplier,
    newFeeMultiplier: event.params.newFeeMultiplier,
  };

  context.Aggregate_FeeMultiplierUpdated.set(entity);
});

Aggregate.FeeReceiverUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_FeeReceiverUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    oldFeeReceiver: event.params.oldFeeReceiver,
    newFeeReceiver: event.params.newFeeReceiver,
  };

  context.Aggregate_FeeReceiverUpdated.set(entity);
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
});

Aggregate.TargetAllowlistUpdated.handler(async ({ event, context }) => {
  const entity: Aggregate_TargetAllowlistUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    target: event.params.target,
    allowed: event.params.allowed,
  };

  context.Aggregate_TargetAllowlistUpdated.set(entity);
});
