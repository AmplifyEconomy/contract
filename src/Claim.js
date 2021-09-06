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
    const nodeHeight = node.startHeight;
    const currentHeight = SmartWeave.block.height;

    const delta = currentHeight  - nodeHeight;
    const epochs = Math.floor(delta / epoch);
    const pendingClaims = parseInt(epochs - claims);
    const netDistribution = parseFloat(pendingClaims * distribution);

    if (Number.isNaN(pendingClaims)) {
        throw new ContractError('Invalid value for "pendingClaims". Must be an integer')
    }

    if (Number.isNaN(netDistribution)) {
        throw new ContractError('Invalid value for "netDistribution". Must be a float')
    }

    if (networks[name].pool < netDistribution) {
        throw new ContractError('Pool balance is too low to make a claim');
    }

    networks[name].pool -= netDistribution;
    
    if (target in balances) {
        balances[target] += netDistribution;
    } else {
        balances[target] = netDistribution;
    }


    node.claims += pendingClaims;

    return { state }
}