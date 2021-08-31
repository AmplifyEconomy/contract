export function Network(state, action) {
    const networks = state.networks;
    const input = action.input;
    const name = input.name;

    if (name) {
        return { result: networks[name] }
    } else {
        return { result: networks }
    }
}