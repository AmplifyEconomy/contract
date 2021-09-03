export function Delete(state, action) {
    const balances = state.balances;
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;

    const name = input.name;

    if (networks[name].owner !== caller) {
        throw new ContractError('You are not the network owner');
    }

    balances[caller] += qty;

    delete networks[name];

    return { state }
}