export function Balance(state, action) {
    const balances = state.balances;
    const input = action.input;

    const target = input.target
    const ticker = state.ticker

    if (typeof target !== 'string') {
      throw new ContractError('Must specificy target to get balance for')
    }

    if (typeof balances[target] !== 'number') {
      throw new ContractError('Cannnot get balance, target does not exist')
    }

    return { result: { target, ticker, balance: balances[target] } }
}