import { createReducer, on } from '@ngrx/store';

import {
  addProductToCart,
  resetState,
  deleteProduct,
  incrementProductItem,
  decrementProductItem,
  countIncr,
  countDecr,
  countReset,
} from './cart.actions';
import { initialState } from './cart.state';

const _cartReducer = createReducer(
  initialState,

  on(addProductToCart, (state, action) => {
   

    return {
      ...state,
      cartProduct: [...state.cartProduct, action.products],
    };
  }),

  on(resetState, (state) => {
    return {
      ...(state = initialState),
    };
  }),
  on(deleteProduct, (state, { id }) => {
    const remainingProducts = state.cartProduct.filter((product) => {
      return product._id !== id;
    });

    return {
      ...state,
      cartProduct: remainingProducts,
    };
  }),

  on(incrementProductItem, (state, action) => {
    const updatedProduct = state.cartProduct.map((oneProd) => {
      return oneProd._id == action.products._id ? action.products : oneProd;
    });

    return {
      ...state,
      cartProduct: updatedProduct,
    };
  }),
  on(decrementProductItem, (state, action) => {
    const updatedProduct = state.cartProduct.map((oneProd) => {
      return oneProd._id == action.products._id ? action.products : oneProd;
    });

    return {
      ...state,
      cartProduct: updatedProduct,
    };
  }),

  //---cart counter----
  on(countIncr, (state) => {
    return {
      ...state,
      counter: state.counter + 1,
    };
  }),
  on(countDecr, (state) => {
    return {
      ...state,
      counter: state.counter - 1,
    };
  }),
  on(countReset, (state) => {
    return {
      ...state,
      counter: 0,
    };
  })
);

export function cartReducer(state: any, action: any) {
  return _cartReducer(state, action);
}
