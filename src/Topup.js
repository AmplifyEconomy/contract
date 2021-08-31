export function Topup(state, action) {
    const balances = state.balances;
    const networks = state.networks;
    const input = action.input;
    
    const caller = action.caller;

    const name = input.name;
    const pool = input.pool;

    if (!networks[name]) {
        throw new ContractError('Network does not exist');
    }

    if (balances[caller] < pool || pool <= 0) {
        throw new ContractError('AMP balance invalid for topping up pool');
    }

    balances[caller] -= pool;
    networks[name].pool += pool;

    return { state }
}