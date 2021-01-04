import PRODUCTS from '../../data/dummy-data'
import { DELETE_PRODUCT, UPDATE_PRODUCT, CREATE_PRODUCT, SET_PRODUCTS } from '../actions/products'
import Product from '../../models/product'

const initialState = {
    avaliableProducts: [],
    userProducts: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case SET_PRODUCTS:
            return{
                avaliableProducts: action.products,
                userProducts: action.userProducts
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id, 
                action.productData.ownerId, 
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.description, 
                action.productData.price
            )
            return {
                ...state,
                avaliableProducts: state.avaliableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct),
            }
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pid)
            const updatedProduct = new Product(
                action.pid, 
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[productIndex].price
            )
            const updatedUserProducts = [...state.userProducts]
            updatedUserProducts[productIndex] = updatedProduct

            const avaliableProductIndex = state.avaliableProducts.findIndex(prod => prod.id === action.pid)
            const updatedAvaliableProducts = [...state.avaliableProducts]
            updatedAvaliableProducts[avaliableProductIndex] = updatedProduct
            return {
                ...state,
                avaliableProducts: updatedAvaliableProducts,
                userProducts: updatedUserProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                avaliableProducts: state.avaliableProducts.filter(product => product.id !== action.pid),
            }
    }
    return state
}