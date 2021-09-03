export function Approve(state, action) {
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;

    const name = input.name;
    const address = input.address;

    if (!networks[name]) {
        throw new ContractError('Network does not exist');
    }

    if (networks[name].owner !== caller) {
        throw new ContractError('You are not the network owner');
    }

    if (!networks[name].pendingNodes[address]) {
        throw new ContractError('Pending node does not exist');
    }

    networks[name].nodes[address] = networks[name].pendingNodes[address];
    networks[name].nodes[address].startHeight = SmartWeave.block.height;

    delete networks[name].pendingNodes[address];

    return { state }
}