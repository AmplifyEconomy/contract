import { Transfer } from './Transfer';
import { Balance } from './Balance';
import { Create } from './Create';
import { Network } from './Network';
import { Name } from './Name';
import { Join } from './Join';
import { Approve } from './Approve';
import { Deny } from './Deny';
import { Remove } from './Remove';
import { Quarantine } from './Quarantine';
import { Claim } from './Claim';
import { Topup } from './Topup';

export async function handle(state, action) {
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
