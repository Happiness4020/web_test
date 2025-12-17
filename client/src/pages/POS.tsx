import { useEffect, useState } from "react";
import { fetchProducts, createOrder, type Product } from "../api";
import { getImg, formatVND } from "../utils/formatters";
import "../css/pos.css";

// Môi trường dev fallback icon
const PlaceholderIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Array<Product & { qty: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const inc = (id: number) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  const dec = (id: number) =>
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  const remove = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const totalQty = cart.reduce((sum, p) => sum + p.qty, 0);

  const handlePayClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmPay = async () => {
    setShowConfirm(false);
    if (!cart.length) return;
    try {
      const expandedIds = cart.flatMap((p) => Array(p.qty).fill(p.id));
      await createOrder(expandedIds);
      setNotification({
        type: "success",
        message: "Thanh toán thành công!",
      });
      setCart([]);
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setNotification({
        type: "error",
        message: "Thanh toán thất bại! Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancelPay = () => {
    setShowConfirm(false);
  };

  if (loading) return <div className="pos-loading">Đang tải dữ liệu...</div>;

  return (
    <div className="pos-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`pos-toast pos-toast-${notification.type}`}>
          <div className="pos-toast-content">
            {notification.type === "success" ? (
              <svg
                className="pos-toast-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="pos-toast-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="pos-toast-message">{notification.message}</span>
          </div>
          <div className="pos-toast-progress"></div>
        </div>
      )}

      <div className="pos-flex">
        {/* --- Confirmation Dialog --- */}
        {showConfirm && (
          <div className="pos-confirm-overlay">
            <div className="pos-confirm-dialog">
              <div className="pos-confirm-header">
                <h3>Xác nhận thanh toán</h3>
              </div>
              <div className="pos-confirm-body">
                <p>Bạn có chắc chắn muốn thanh toán?</p>
                <div className="pos-confirm-summary">
                  <div className="pos-confirm-item">
                    <span>Số lượng sản phẩm:</span>
                    <span>{totalQty}</span>
                  </div>
                  <div className="pos-confirm-item">
                    <span>Tổng tiền:</span>
                    <span className="pos-confirm-total">
                      {formatVND(total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pos-confirm-footer">
                <button
                  className="pos-confirm-cancel"
                  onClick={handleCancelPay}
                >
                  Hủy
                </button>
                <button
                  className="pos-confirm-submit"
                  onClick={handleConfirmPay}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Product List Section --- */}
        <section className="pos-section">
          <div className="pos-header">
            <h2 className="pos-title">Menu</h2>
            <span className="pos-subtitle">Chọn món để thêm vào đơn hàng</span>
          </div>
          <div className="pos-grid">
            {products.map((p) => (
              <div key={p.id} className="pos-card" onClick={() => addToCart(p)}>
                <div className="pos-img-wrapper">
                  <img
                    src={getImg(p.image)}
                    alt={p.name}
                    className="pos-img"
                    loading="lazy"
                  />
                </div>
                <div className="pos-card-content">
                  <div>
                    <div className="pos-card-name">{p.name}</div>
                    <div className="pos-card-footer">
                      <div className="pos-card-price">{formatVND(p.price)}</div>
                      <button className="pos-add-btn">+ Thêm</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Cart Sidebar Section --- */}
        <section className="pos-cart-section">
          <div className="pos-cart-box">
            <div className="pos-cart-header-area">
              <h3 className="pos-cart-title">
                <PlaceholderIcon /> Đơn Hàng ({totalQty})
              </h3>
            </div>

            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <p>Chưa có sản phẩm nào.</p>
                <p style={{ fontSize: "0.8rem" }}>
                  Vui lòng chọn món bên trái.
                </p>
              </div>
            ) : (
              <ul className="pos-cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="pos-cart-item">
                    <img
                      src={getImg(item.image)}
                      alt={item.name}
                      className="pos-cart-img"
                    />
                    <div className="pos-cart-item-info">
                      <div className="pos-cart-item-name">{item.name}</div>
                      <div className="pos-cart-item-price">
                        {formatVND(item.price)}
                      </div>
                    </div>

                    <div className="pos-cart-actions">
                      <div className="pos-cart-qty-control">
                        <button
                          className="pos-cart-btn"
                          onClick={() => dec(item.id)}
                        >
                          -
                        </button>
                        <span className="pos-cart-qty">{item.qty}</span>
                        <button
                          className="pos-cart-btn"
                          onClick={() => inc(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="pos-cart-remove"
                        onClick={() => remove(item.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="pos-cart-footer">
              <div className="pos-cart-row">
                <span>Tạm tính</span>
                <span>{formatVND(total)}</span>
              </div>
              <div className="pos-cart-total">
                <span>Tổng cộng</span>
                <span>{formatVND(total)}</span>
              </div>
              <button
                disabled={!cart.length}
                className="pos-cart-pay"
                onClick={handlePayClick}
              >
                Thanh toán ngay
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
