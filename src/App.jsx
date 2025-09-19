import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './components/layout/NotFoundPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContainerPage from './components/layout/ContainerPage';
import ItemListContainer from './components/item/ItemListContainer';
import ItemDetailContainer from './components/item/ItemDetailContainer';
import CartProvider from './context/CartContext';
import CartContainer from './components/cart/CartContainer';
import CheckoutContainer from './components/checkout/CheckoutContainer';

function App() {

  return (
    <BrowserRouter>
      <CartProvider>
        <ContainerPage>
          <Routes>
            <Route path="/" element={<ItemListContainer />} />
            <Route path="/categories/:category" element={<ItemListContainer />} />
            <Route path="/detail/:id" element={<ItemDetailContainer />} />
            <Route path="/cart/" element={<CartContainer />} />
            <Route path="/checkout/" element={<CheckoutContainer />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ContainerPage>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
