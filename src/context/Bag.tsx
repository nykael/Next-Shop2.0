import { ReactNode, createContext, useReducer } from "react";

export interface CartContextDataProps {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
    quantity: number;
}

interface CartContextProviderProps {
    children: ReactNode
}

type CartAction = 
|{ type:'ADD_TO_CART'; payload: CartContextDataProps } 
|{ type:'REMOVE_FROM_CART'; payload: CartContextDataProps };

interface CartState extends Array<CartContextDataProps> {}

interface CartContextProps {
    cart: CartState;
    dispatch: React.Dispatch<CartAction>
}

export const CartContext = createContext<CartContextProps | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
      case 'ADD_TO_CART':
        const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
        if (existingItemIndex !== -1) {
          const updatedCart = state.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          return updatedCart;
        } else {
          return [...state, { ...action.payload, quantity: 1 }];
        }
  
      case 'REMOVE_FROM_CART':
        const itemToRemove = state.find(item => item.id === action.payload.id);
        if(itemToRemove) {
            if(itemToRemove.quantity > 1) {
                const updatedCart = state.map(item => 
                 item.id === action.payload.id ? {...item, quantity: item.quantity - 1 } : item
                )
                return updatedCart
            } else {
                return state.filter(item => item.id !== action.payload.id)
            }
        }
        
        return state
      default:
        return state;
    }
  };


export function BagContextProvider({ children }: CartContextProviderProps) {
    const [cart, dispatch] = useReducer(cartReducer, []);
  
    console.log('AQUIEEEE =>', cart);
  
    return (
      <CartContext.Provider value={{ cart, dispatch }}>
        {children}
      </CartContext.Provider>
    );
  }