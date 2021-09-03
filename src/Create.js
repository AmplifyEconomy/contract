export function Create(state, action) {
    const balances = state.balances;
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;
    const name = input.name;
    const url = input.url;
    const description = input.description;
    const consensus = input.consensus;
    const network = input.network;
    const networkAppName = input.networkAppName;
    const networkId = input.networkId;
    const token = input.token;
    const pool = input.pool;
    const epoch = input.epoch;
    const distribution = input.distribution;
    const nodes = input.nodes;

    if (networks[name]) {
        throw new ContractError('Name already in use');
    }

    if (balances[caller] < pool || pool <= 0) {
        throw new ContractError('AMP balance invalid for pool');
    }

    balances[caller] -= pool;

    networks[name] = {
        "owner": caller,
        "url": url,
        "description": description,
        "consensus": consensus,
        "network": network,
        "networkAppName": networkAppName,
        "networkId": networkId,
        "token": token,
        "pool": pool,
        "epoch": epoch,
        "distribution": distribution,
        "maxNodes": nodes,
        "startHeight": SmartWeave.block.height,
        "pendingNodes": {},
        "nodes": {}
    }

    return { state }
}