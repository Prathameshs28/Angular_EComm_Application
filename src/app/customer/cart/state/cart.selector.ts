import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CartState } from "./cart.state";


    export const ADD_TO_CART = 'cart';

    const getCartState = createFeatureSelector<CartState>(ADD_TO_CART);

    export const getCartProd = createSelector(getCartState, (state) =>{
        return state.cartProduct;
    })



    //------------ cart count ----------------


  

    const getCartCountState = createFeatureSelector<CartState>(ADD_TO_CART);
   
 
    export const getCounter = createSelector(getCartCountState, (state) =>{
        return state.counter
    })


    