import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import authReducer from './state'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

const store = configureStore({
  reducer: authReducer
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <Toaster/>
    <App />
  </BrowserRouter>  
  </Provider>,
)
