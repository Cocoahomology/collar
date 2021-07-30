import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter'
import poolsReducer from './pools'

export default configureStore({
  reducer: {
    counter: counterReducer,
    pools: poolsReducer,
  },
})
