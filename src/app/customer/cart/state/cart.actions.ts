import { createAction,props } from "@ngrx/store";
import { CartProducts } from "../modal/cart.modal";



export const ADD_PRODUCT_TO_CART = '[cart page] add product to cart';
export const RESET_STATE = 'reset state - clear cart';
export const DELETE_PRODUCT = 'delete product';

export const INCREMENT_PROD_ITEM = 'increment product count';
export const DECREMENT_PROD_ITEM = 'decrement product count';


export const addProductToCart = createAction(ADD_PRODUCT_TO_CART, props<{products:CartProducts}>());

export const resetState = createAction(RESET_STATE);

export const deleteProduct = createAction(DELETE_PRODUCT,props<{id:any}>());

export const incrementProductItem = createAction(INCREMENT_PROD_ITEM,props<{products:CartProducts}>());
export const decrementProductItem = createAction(DECREMENT_PROD_ITEM,props<{products:CartProducts}>());


// ---------------- cart count

        export const countIncr = createAction('increment');
        export const countDecr = createAction('decrement');
        export const countReset = createAction('reset');