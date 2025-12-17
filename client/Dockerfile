FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time overrides (can be set via docker-compose build args)
ARG VITE_API_BASE=http://server:5000/api
ARG VITE_SIGNALR_URL=http://server:5000/orderhub
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_SIGNALR_URL=$VITE_SIGNALR_URL

RUN npm run build

FROM nginx:1.27-alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

