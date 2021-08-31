'use strict';



function Transfer(state, action) {
    const balances = state.balances;
    const input = action.input;

    const caller = action.caller;

    const target = input.target;
    const qty = input.qty;

    if (!Number.isInteger(qty)) {
        throw new ContractError('Invalid value for "qty". Must be an integer')
    }

    if (!target) {
        throw new ContractError('No target specified')
    }

    if (qty <= 0 || caller === target) {
        throw new ContractError('Invalid token transfer')
    }

    if (balances[caller] < qty) {
        throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`)
    }

    balances[caller] -= qty;
    
    if (target in balances) {
        balances[target] += qty;
    } else {
        balances[target] = qty;
    }
    
    return { state }
}

function Balance(state, action) {
    const balances = state.balances;
    const input = action.input;

    const target = input.target;
    const ticker = state.ticker;

    if (typeof target !== 'string') {
      throw new ContractError('Must specificy target to get balance for')
    }

    if (typeof balances[target] !== 'number') {
      throw new ContractError('Cannnot get balance, target does not exist')
    }

    return { result: { target, ticker, balance: balances[target] } }
}

function Create(state, action) {
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
        "token": token,
        "pool": pool,
        "epoch": epoch,
        "distribution": distribution,
        "maxNodes": nodes,
        "startHeight": SmartWeave.block.height,
        "pendingNodes": [],
        "nodes": []
    };

    return { state }
}

function Network(state, action) {
    const networks = state.networks;
    const input = action.input;
    const name = input.name;

    if (name) {
        return { result: networks[name] }
    } else {
        return { result: networks }
    }
}

function Name(state, action) {
    const networks = state.networks;
    const input = action.input;

    const name = input.name;

    if (networks[name]) {
        throw new ContractError('Name already in use');
    }

    return { result: 'OK' }
}

function Join(state, action) {
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

function Approve(state, action) {
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

    if (!networks[name].pendingNodes[address]) {
        throw new ContractError('Pending node does not exist');
    }

    networks[name].nodes[address] = networks[name].pendingNodes[address];

    delete networks[name].pendingNodes[address];

    return { state }
}

function Deny(state, action) {
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

    if (!networks[name].pendingNodes[address]) {
        throw new ContractError('Pending node does not exist');
    }

    delete networks[name].pendingNodes[address];

    return { state }
}

function Remove(state, action) {
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

function Quarantine(state, action) {
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

    networks[name].pendingNodes[address] = networks[name].nodes[address];

    delete networks[name].nodes[address];

    return { state }
}

function Claim(state, action) {
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

    networks[name].pool -= qty;
    
    if (target in balances) {
        balances[target] += qty;
    } else {
        balances[target] = qty;
    }


    node.claims += pendingClaims;

    return { state }
}

function Topup(state, action) {
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

async function handle(state, action) {
  switch (action.input.function) {
    case 'transfer':
      return Transfer(state, action);
    case 'balance':
      return Balance(state, action);
    case 'create':
      return Create(state, action);
    case 'name':
      return Name(state, action);
    case 'network':
      return Network(state, action);
    case 'join':
      return Join(state, action);
    case 'approve':
      return Approve(state, action);
    case 'remove':
      return Remove(state, action);
    case 'deny':
      return Deny(state, action);
    case 'quarantine':
      return Quarantine(state, action);
    case 'claim':
      return Claim(state, action);
    case 'topup':
      return Topup(state, action);
    default:
      throw new ContractError(`Invalid function: "${action.input.function}"`)
  }
}


