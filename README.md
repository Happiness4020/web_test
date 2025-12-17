# 🛒 Hệ thống POS đơn giản (React + ASP.NET Core + SignalR)

Một ứng dụng quản lý bán hàng thời gian thực với giao diện người dùng hiện đại, hỗ trợ cập nhật đơn hàng tức thời qua SignalR.

## 📋 Mục lục

- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt](#cài-đặt)
- [Chạy cục bộ (Dev)](#chạy-cục-bộ-dev)
- [Chạy bằng Docker](#chạy-bằng-docker)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các tính năng](#các-tính-năng)
- [Khắc phục sự cố](#khắc-phục-sự-cố)

---

## 🛠️ Yêu cầu môi trường

Trước khi cài đặt, đảm bảo bạn đã cài đặt:

### Bắt buộc

- **Node.js** phiên bản 20+ ([Tải từ nodejs.org](https://nodejs.org/))

  ```bash
  node --version  # Kiểm tra phiên bản
  npm --version
  ```

- **.NET 8 SDK** hoặc cao hơn ([Tải từ dotnet.microsoft.com](https://dotnet.microsoft.com/download))
  ```bash
  dotnet --version  # Kiểm tra phiên bản cài đặt
  ```

### Tuỳ chọn (nếu dùng Docker)

- **Docker Desktop** ([Tải từ docker.com](https://www.docker.com/products/docker-desktop))
  ```bash
  docker --version
  docker-compose --version
  ```

---

## 📦 Cài đặt

### Bước 1: Clone hoặc tải dự án

```bash
# Nếu từ Git
git clone https://github.com/Happiness4020/web_test.git
cd web_test

# Nếu tải file nén, giải nén và mở thư mục gốc
```

### Bước 2: Cài đặt dependencies

#### Backend

```bash
cd server
dotnet restore
```

- `dotnet restore` tải xuống tất cả NuGet packages cần thiết

#### Frontend

```bash
cd client
npm install
```

- `npm install` cài đặt tất cả dependencies từ `package.json`

---

## 🚀 Chạy cục bộ (Dev)

### Cách 1: Chạy Backend và Frontend riêng (Khuyên dùng)

#### Bước 1: Khởi động Backend (ASP.NET Core)

Mở **Terminal/PowerShell** thứ nhất:

```bash
cd server
dotnet run --urls http://localhost:5000
```

**Kết quả thành công:**

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Application started. Press Ctrl+C to stop.
```

✅ Backend chạy trên:

- API: `http://localhost:5000/api`
- SignalR Hub: `ws://localhost:5000/orderhub`

---

#### Bước 2: Khởi động Frontend (React + Vite)

Mở **Terminal/PowerShell** thứ hai:

```bash
cd client
npm run dev -- --host --port 5173
```

**Kết quả thành công:**

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend chạy trên: `http://localhost:5173`

**Mở trình duyệt:**

- Truy cập `http://localhost:5173` để sử dụng ứng dụng

---

### Biến môi trường Frontend (.env.local)

Tệp `client/.env.local` chứa cấu hình:

```env
VITE_API_BASE=http://localhost:5000/api
VITE_SIGNALR_URL=http://localhost:5000/orderhub
```

**Chỉnh sửa nếu cần:**

- Backend chạy cổng khác? Cập nhật `VITE_API_BASE`
- SignalR hub khác? Cập nhật `VITE_SIGNALR_URL`

---

### Cách 2: Build & Production (không dev mode)

#### Frontend Production Build

```bash
cd client
npm run build
npm run preview
```

- Build ra folder `dist/`
- Preview ở `http://localhost:4173`

#### Backend Release Build

```bash
cd server
dotnet publish -c Release
dotnet bin/Release/net10.0/server.dll
```

---

## 🐳 Chạy bằng Docker Compose

### Điều kiện

- Docker Desktop đang chạy
- Ports `5000` và `5173` khả dụng

### Bước 1: Build và chạy

```bash
# Tại thư mục gốc dự án
docker-compose up --build
```

**Quá trình:**

1. Build image Backend (ASP.NET Core)
2. Build image Frontend (Vite + Nginx)
3. Khởi động cả hai container

**Kết quả thành công:**

```
server_1    | info: Microsoft.Hosting.Lifetime[14]
server_1    |       Now listening on: http://0.0.0.0:5000
frontend_1  | ...
```

### Bước 2: Truy cập

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **SignalR**: `ws://localhost:5000/orderhub`

### Bước 3: Dừng container

```bash
# Dừng mà không xóa
docker-compose stop

# Dừng và xóa container
docker-compose down

# Xóa volume (dữ liệu)
docker-compose down -v
```

### Cấu hình Docker Environment

#### Backend (server/Dockerfile)

- Base image: `mcr.microsoft.com/dotnet/aspnet:8.0`
- Expose port: `5000`
- Environment: `ASPNETCORE_URLS=http://+:5000`

#### Frontend (client/Dockerfile)

- Build: Vite build optimization
- Server: Nginx
- Expose port: `80` (ánh xạ ra `5173`)
- Build args:
  ```dockerfile
  ARG VITE_API_BASE=http://server:5000/api
  ARG VITE_SIGNALR_URL=http://server:5000/orderhub
  ```

---

## 📁 Cấu trúc dự án

```
Web_Test_Visnam/
├── client/                    # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api.ts           # API client (Axios)
│   │   ├── signalr.ts       # SignalR connection
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   ├── pages/
│   │   │   ├── POS.tsx      # Trang bán hàng
│   │   │   └── Orders.tsx   # Trang đơn hàng
│   │   ├── utils/
│   │   │   ├── config.ts    # Centralized config
│   │   │   ├── formatters.ts # Utility functions
│   │   │   └── orders.ts    # Order helpers
│   │   └── css/
│   │       ├── pos.css      # POS styles
│   │       ├── orders.css   # Orders styles
│   │       └── app.css      # App layout
│   ├── .env.local           # Dev environment
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── vite.config.ts       # Vite config
│   └── Dockerfile           # Docker build
│
├── server/                   # ASP.NET Core Backend
│   ├── Controllers/
│   │   ├── OrderController.cs  # Order endpoints
│   │   └── ProductController.cs # Product endpoints
│   ├── Hubs/
│   │   └── OrderHub.cs      # SignalR hub
│   ├── Models/
│   │   └── Models.cs        # Data models
│   ├── Services/
│   │   └── OrderService.cs  # Business logic
│   ├── wwwroot/
│   │   └── images/          # Product images
│   ├── Program.cs           # App configuration
│   ├── server.csproj        # Project file
│   ├── Dockerfile           # Docker build
│   └── appsettings.json     # Config file
│
├── docker-compose.yml       # Docker orchestration
├── README.md               # Documentation (file này)
```

---

## ✨ Các tính năng

### Frontend (React)

- ✅ Giao diện POS với grid sản phẩm
- ✅ Giỏ hàng tương tác (thêm, sửa, xóa)
- ✅ Định dạng tiền Việt (VND)
- ✅ Thông báo thanh toán (toast)
- ✅ Dialog xác nhận thanh toán
- ✅ Cập nhật đơn hàng real-time (SignalR)
- ✅ Lazy loading trang với React.lazy()
- ✅ TypeScript type safety

### Backend (.NET)

- ✅ REST API (GET, POST)
- ✅ SignalR real-time notifications
- ✅ Service layer pattern
- ✅ Dependency injection
- ✅ CORS support
- ✅ Static file serving (images)
- ✅ In-memory data store

---

## 🐛 Khắc phục sự cố

### 1. Backend không khởi động

```
error: Listen on 'http://0.0.0.0:5000' failed
```

**Giải pháp:**

- Kiểm tra port 5000 đã bị sử dụng: `netstat -ano | findstr :5000` (Windows)
- Đóng ứng dụng dùng port 5000 hoặc đổi port
- Chạy với port khác: `dotnet run --urls http://localhost:5001`
- Cập nhật `VITE_API_BASE` trong file '.env' của Frontend nếu đổi port

### 2. Frontend không kết nối backend

```
GET http://localhost:5000/api/products 404 (Not Found)
```

**Giải pháp:**

- Đảm bảo backend đang chạy
- Kiểm tra backend có đổi port khi chạy hay không
- Kiểm tra `.env` có đúng `VITE_API_BASE`
- Kiểm tra CORS: Backend phải allow frontend URL
- Xóa cache browser: `Ctrl+Shift+Delete`

### 3. SignalR không kết nối

```
WebSocket is closed with status code 1006
```

**Giải pháp:**

- Backend phải chạy HTTP (không HTTPS trong dev)
- Kiểm tra `VITE_SIGNALR_URL` trong file '.env' đúng endpoint
- Kiểm tra firewall không chặn WebSocket

### 4. Docker build thất bại

```
failed to solve with frontend dockerfile.v0
```

**Giải pháp:**

```bash
# Clear Docker cache
docker system prune -a

# Build lại
docker-compose up --build
```

### 5. Lỗi dependencies

```
npm ERR! Cannot find module
```

**Giải pháp:**

```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### 6. Port đã được sử dụng

```
EADDRINUSE: address already in use :::5173
```

**Giải pháp:**

```bash
# Windows - tìm PID sử dụng port
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F

# Hoặc chạy port khác
Chạy: npm run dev -- --port 5174
Hoặc: npx vite --host --port 5174
```

**Nếu dùng terminal thì khi đổi port vào file 'Program.cs' của backend đổi port của frontend lại**
```
.WithOrigins(
                "http://localhost:5174",
                "http://127.0.0.1:5174"
            )
```
- Sau đó chỉ cần chạy lại 2 terminal của frontend và backend



**Nếu dùng Docker-compose thì** 
```
server:
    build:
      context: ./server
    ports:
      - "5000:5000"       --> chỉnh port backend 5000 thành 5001 
    environment:
      ASPNETCORE_URLS: http://+:5000
    networks:
      - posnet

  client:
    build:
      context: ./client
      args:
        # Dùng host (localhost) vì trình duyệt truy cập từ máy bạn, không nằm trong mạng docker internal
        VITE_API_BASE: http://localhost:5000/api
        VITE_SIGNALR_URL: http://localhost:5000/orderhub
    ports:
      - "5173:80"        --> chỉnh port frontend 5173 thành 5174 
    depends_on:
      - server
    networks:
      - posnet
```
- Sau đó chạy lại lệnh:
```bash
# Tại thư mục gốc dự án
docker-compose up --build
```


---

## 💡 Lưu ý quan trọng

### Phát triển

- CORS đang mở (cho phép mọi request từ mọi nguồn)
- HTTPS redirection đã tắt
- Dữ liệu lưu trong memory (mất khi restart)

---

## 📝 Ví dụ API

### Lấy danh sách sản phẩm

```bash
curl -X GET http://localhost:5000/api/products
```

### Tạo đơn hàng

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d "[1,1,2,3]"
```

### Lấy danh sách đơn hàng

```bash
curl -X GET http://localhost:5000/api/orders
```

---

## 🔗 Liên kết hữu ích

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core/)
- [SignalR Documentation](https://docs.microsoft.com/aspnet/signalr/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Docker Docs](https://docs.docker.com/)
