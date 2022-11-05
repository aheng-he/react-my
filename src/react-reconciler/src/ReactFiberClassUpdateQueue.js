import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export const UpdateState = 0;

export function initializeUpdateQueue(fiber){
    const queue = {
        shared: {
            pending: null,
        }
    }
    fiber.updateQueue = queue;
}

export function createUpdate(){
    const update = {tag: UpdateState}
    return update
}

export function enqueueUpdate(fiber, update){
    const updateQueue = fiber.updateQueue;
    const sharedQueue = updateQueue.shared;

    const pending = sharedQueue.pending;

    if(pending === null){
        update.next = update;
    }else{
        update.next = pending.next;
        pending.next = update;
    }

    updateQueue.shared.pending = update;
    return markUpdateLaneFromFiberToRoot(fiber)
}