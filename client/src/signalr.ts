import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { config } from "./utils/config";

export function createOrderHubConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(config.SIGNALR_URL)
    .withAutomaticReconnect()
    .build();
}
