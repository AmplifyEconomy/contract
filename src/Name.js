export function Name(state, action) {
    const networks = state.networks;
    const input = action.input;

    const name = input.name;

    if (networks[name]) {
        throw new ContractError('Name already in use');
    }

    return { result: 'OK' }
}