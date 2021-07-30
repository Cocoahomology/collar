import { createSlice } from '@reduxjs/toolkit'
import { pools, clpts } from '../constants'

export const counterSlice = createSlice({
  name: 'pools',
  initialState: {
    data: pools,
    clpts,
  },
  reducers: {
    setPoolsData: (state, { payload }) => {
      state.data = payload
    },
    setClptsData: (state, { payload }) => {
      state.clpts = payload
    },
  },
})

export const { setPoolsData, setClptsData } = counterSlice.actions

export default counterSlice.reducer
