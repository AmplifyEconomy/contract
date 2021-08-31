export function Remove(state, action) {
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

    if (!networks[name].nodes[address]) {
        throw new ContractError('Node does not exist');
    }

    delete networks[name].nodes[address];

    return { state }
}