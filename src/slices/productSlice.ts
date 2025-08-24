import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {ProductData} from "../model/ProductData.ts";
import {backendApi} from "../api.ts";
import mongoose from "mongoose";

interface ProductState {
    list: ProductData[],
    error: string | null | undefined

}

//type ekai object ekak asiign kara
const initialState: ProductState = {
    list:[],
    error: null,

}

export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async () => {
        const response = await backendApi.get("/products/all");
        console.log("Response received at getAllProducts endpoint", response.data);
        return await response.data;
        console.error("Error fetching products:", response.data);
    }
)
export const addProduct = createAsyncThunk(
    'product/addProduct',
  async(product: FormData | Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/products/save", product);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (product: ProductData, {rejectWithValue }) => {
        try {
            console.log("Request received at updateProduct endpoint", product);

            // Validate the product ID format (e.g., PROD<number>)
            if (!product.id || !/^PROD\d+$/.test(product.id)) {
                throw new Error("Invalid product ID format.");
            }

            const response = await backendApi.put(`/products/update/${product.id}`, product);
            // Re-fetch the product list after a successful update
            // dispatch(getAllProducts());
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id: string) => {
        const response = await backendApi.delete(`/products/delete/${id}`);
        return await response.data;
    }
);

//producr ekata related dewal maintain karana nisa
//udin define karapu init
const productSlice = createSlice({
    name: 'product',
    initialState: initialState,
    reducers:{},
    extraReducers:(builder) => {

//Async Response pending
        builder.addCase(getAllProducts.pending, (state: ProductState) => {
            alert("Product data is still loading...");
            state.error = null; // Reset error state
// Async Response Complete State
        }) .addCase(getAllProducts.fulfilled,(state:ProductState, action:any) => {
            state.list = action.payload;
// Async Response Failure State
        }) .addCase(getAllProducts.rejected, (state:ProductState, action:any) => {
            state.error = action.error.message;
            alert("Error loading :" + state.error);
        })
        builder
            .addCase(updateProduct.fulfilled, (state: ProductState, action: any) => {
                const index = state.list.findIndex((prod) => prod.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
        builder
            .addCase(deleteProduct.fulfilled, (state: ProductState, action: any) => {
                // Remove the deleted product from the list
                state.list = state.list.filter((product) => product.id !== action.meta.arg);
            });
    }
});

export default productSlice.reducer;

