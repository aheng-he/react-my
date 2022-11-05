import { scheduleCallback } from "scheduler"

export function scheduleUpdateOnFiber(root){
    ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root){
    scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

function performConcurrentWorkOnRoot(root){

}