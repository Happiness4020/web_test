import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../api";
import { createOrderHubConnection } from "../signalr";
import { getImg, formatVND, formatDate } from "../utils/formatters";
import { groupProductsByName } from "../utils/orders";
import "../css/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
    const connection = createOrderHubConnection();
    connection.start().then(() => {
      connection.on("NewOrder", (order: Order) => {
        setOrders((prev) => [order, ...prev]);
      });
    });
    return () => {
      connection.off("NewOrder");
      connection.stop();
    };
  }, []);

  if (loading)
    return <div className="orders-loading">Đang tải đơn hàng...</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-title">Đơn hàng</h2>
        <span className="orders-subtitle">Cập nhật realtime qua SignalR</span>
      </div>
      {!orders.length && <div className="orders-empty">Chưa có đơn hàng.</div>}
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="orders-card">
            <div className="orders-card-header">
              <div className="orders-card-id">#{order.id}</div>
              <span className="orders-card-total">
                Tổng: {formatVND(order.totalAmount)}
              </span>
              <span className="orders-card-time">
                {formatDate(order.paymentTime)}
              </span>
            </div>
            <div className="orders-card-products">
              {groupProductsByName(order.products).map((item) => (
                <div
                  key={`${order.id}-${item.product.id}`}
                  className="orders-product"
                >
                  <img
                    src={getImg(item.product.image)}
                    alt={item.product.name}
                    className="orders-product-img"
                    loading="lazy"
                  />
                  <span className="orders-product-name">
                    {item.product.name} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
