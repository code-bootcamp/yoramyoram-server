import { Product } from 'src/apis/products/entities/product.entity';
import { IAuthUser, IContext } from 'src/commons/types/context';
import { PAYMENT_STATUS_ENUM } from '../entities/payment.entity';

export interface IPaymentServiceCreate {
  impUid: string;
  amount: number;
  user: IContext['req'];
  //product?: IAuthProduct['product'];
  status?: PAYMENT_STATUS_ENUM;
}
