import { cartReducer } from "../customer/cart/state/cart.reducer";
import { CartState } from "../customer/cart/state/cart.state";


export interface AppState{
  cart:CartState,
  
  

}

export const appReducer ={ 
    cart:cartReducer
}

