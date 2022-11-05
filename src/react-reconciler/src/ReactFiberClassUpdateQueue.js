import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export const UpdateState = 0;

export function initializeUpdateQueue(fiber){
    const queue = {
        shared: {
            // 循环链表
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
    // pending 要指向最后一个更新，最后一个更新的next指向第一个更新 => 方便后续继续添加更新
    // 单向循环链表
    updateQueue.shared.pending = update;
    return markUpdateLaneFromFiberToRoot(fiber)
}