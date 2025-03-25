
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingBag, ArrowUpRight, LogIn } from 'lucide-react';
import { PaymentMethod } from '@/components/PaymentMethods';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

interface OrderHistory {
  orderNumber: string;
  restaurantName: string;
  totalValue: number;
  orderTime: string;
  items: OrderItem[];
  status: 'preparing' | 'ready' | 'delivering' | 'delivered';
  paymentMethod: PaymentMethod;
  rating?: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      setIsLoggedIn(true);
      
      // Retrieve user-specific order history
      const historyKey = `orderHistory_${user.email}`;
      const storedOrders = localStorage.getItem(historyKey);
      
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
        } catch (error) {
          console.error('Error parsing order history:', error);
        }
      }
    } else {
      // Not logged in, show empty state
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <p className="text-center">Carregando histórico de pedidos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingBag className="mr-2" />
              Seus Pedidos
            </h1>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <LogIn size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Faça login para ver seus pedidos</h3>
                  <p className="text-gray-500 mb-4">Você precisa estar logado para acessar seu histórico de pedidos.</p>
                  <Button 
                    onClick={handleLogin}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Fazer Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <ShoppingBag className="mr-2" />
            Seus Pedidos
          </h1>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-500 mb-4">Você ainda não realizou nenhum pedido.</p>
                  <Link 
                    to="/restaurants" 
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Explorar restaurantes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium">Histórico de Pedidos</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº do Pedido</TableHead>
                      <TableHead>Restaurante</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead className="text-right">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.orderNumber}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.restaurantName}</TableCell>
                        <TableCell>{formatDate(order.orderTime)}</TableCell>
                        <TableCell>R${order.totalValue.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>
                          {order.rating ? (
                            <div className="flex">
                              {[...Array(5)].map((_, index) => (
                                <span 
                                  key={index} 
                                  className={`text-lg ${index < order.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Não avaliado</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link 
                            to={`/order-details?id=${order.orderNumber}`} 
                            className="inline-flex items-center text-red-600 hover:text-red-700"
                          >
                            Ver <ArrowUpRight size={16} className="ml-1" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
