import mongoose from "mongoose";

export interface ClientInterface {
  userID: string;
  color: string;
  status: string;
  blacklistServers: Array<any>;
  blacklistUsers: Array<any>;
  events: Array<{
    name: string;
    start: string;
    end: string;
    emoji: string;
    required: number;
    finished: boolean;
  }>;
}

const Schema = new mongoose.Schema<ClientInterface>({
  userID: String,
  color: String,
  status: String,
  blacklistServers: Array,
  blacklistUsers: Array,
  events: Array,
});

export default mongoose.model("bot", Schema);
