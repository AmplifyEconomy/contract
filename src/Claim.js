export function Claim(state, action) {
    const balances = state.balances;
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;

    const name = input.name;

    if (!networks[name]) {
        throw new ContractError('Network does not exist');
    }

    if (!networks[name].nodes[caller]) {
        throw new ContractError('Node cannot join');
    }

    const epoch = networks[name].epoch;
    const distribution = networks[name].distribution;
    const node = networks[name].nodes[caller];
    const claims = node.claims;
    const nodeHeight = node.height;
    const currentHeight = SmartWeave.block.height;

    const delta = currentHeight  - nodeHeight;
    const epochs = Math.floor(delta / epoch);
    const pendingClaims = epochs - claims;
    const netDistribution = pendingClaims * distribution;

    if (networks[name].pool < netDistribution) {
        throw new ContractError('Pool balance is too low to make a claim');
    }

    networks[name].pool -= qty
    
    if (target in balances) {
        balances[target] += qty
    } else {
        balances[target] = qty
    }


    node.claims += pendingClaims;

    return { state }
}