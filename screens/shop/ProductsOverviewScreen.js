import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Button, Platform, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton'
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import * as productsActions from '../../store/actions/products'
import Colors from '../../constants/colors'


const ProductsOverScreenViewScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState()
    const products = useSelector(state => state.products.avaliableProducts)
    const dispach = useDispatch()

    const loadProducts = useCallback(async () => {
        setError(null)
        setIsRefreshing(true)
        try{
            await dispach(productsActions.fetchProducts())
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false)
    }, [dispach, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts)

        return () => {
            willFocusSub.remove()
        }
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true)
        loadProducts().then(() => {
            setIsLoading(false)
        })
    }, [dispach])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }

    if(error){
        return (
            <View style={styles.centered}>
                <Text>An error ocurred!</Text>
                <Button title="Try again" onPress={loadProducts} color></Button>
            </View>
        )
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary}/>
            </View>
        )
    }

    if(!isLoading && products.length === 0){
        return (
            <View style={styles.centered}>
                <Text>No producs found. Maybe start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                <ProductItem 
                    image={itemData.item.imageUrl} 
                    title={itemData.item.title}  
                    price={itemData.item.price} 
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                    onAddToCart={() => {
                        dispach(cartActions.addToCart(itemData.item))
                    }} 
                >
                    <Button 
                        color={Colors.primary} 
                        title="View Details" 
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title)
                        }}
                    />
                    <Button 
                        color={Colors.primary} 
                        title="To Cart" 
                        onPress={() => {
                            dispach(cartActions.addToCart(itemData.item))
                        }}
                    />
                </ProductItem>
                }
            />
    )
}

ProductsOverScreenViewScreen.navigationOptions = navData => {
    return{
        headerTitle: 'All Products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} 
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }} 
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }} 
                />
            </HeaderButtons>
        )
    }
    
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverScreenViewScreen