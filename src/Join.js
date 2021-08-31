export function Join(state, action) {
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;

    const name = input.name;
    const url = input.url;

    if (!networks[name]) {
        throw new ContractError('Network does not exist');
    }

    if (networks[name].nodes[caller]) {
        throw new ContractError('Already joined');
    }

    if (networks[name].pendingNodes[caller]) {
        throw new ContractError('Already requested to join');
    }

    if (Object.keys(networks[name].nodes).length >= networks[name].maxNodes) {
        throw new ContractError('Maximum nodes reached');
    }

    networks[name].pendingNodes[caller] = {
        url: url,
        height: SmartWeave.block.height,
        claims: 0,
    };

    return { state }
}