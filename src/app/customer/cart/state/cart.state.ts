import { CartProducts } from "../modal/cart.modal";


export interface CartState{
    cartProduct:CartProducts[];
    counter:number;
}

export const initialState:CartState ={
    cartProduct:[],
    counter:0
}