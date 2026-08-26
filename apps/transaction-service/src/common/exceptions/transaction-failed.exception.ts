import { DomainException } from './domain.exception';

export class TransactionFailedException extends DomainException {
  constructor(message = 'Transaction failed') {
    super(message, 500);
  }
}
