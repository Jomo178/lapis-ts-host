import mongoose from "mongoose";

export interface UsersInterface {
  userID: string;
  nickname: string;
  balance: number;
  streak: number;
  streakTime: string;
  favCard: string;
  lf: string;
  bio: string;
  joined: string;
  badges: Array<string>;
  banner: string;
  xp: number;
  banners: Array<number>;
  color: string;
  eventSpace: number;
  workSpace: number;
  triviaStreak: number;
}

const Schema = new mongoose.Schema<UsersInterface>({
  userID: String,
  nickname: String,
  balance: Number,
  streak: Number,
  streakTime: String,
  favCard: String,
  lf: String,
  bio: String,
  joined: String,
  badges: Array,
  banner: String,
  xp: Number,
  banners: Array,
  color: String,
  eventSpace: Number,
  workSpace: Number,
  triviaStreak: Number,
});

export default mongoose.model("users", Schema);
