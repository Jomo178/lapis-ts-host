import mongoose from "mongoose";

interface IssuesInterface {
  name: string;
  act: string;
  subAct: string;
  rarity: number;
  image: string;
  old: boolean;
  createdAt: string;
  code: string;
}

const Schema = new mongoose.Schema<IssuesInterface>({
  name: String,
  act: String,
  subAct: String,
  rarity: Number,
  old: Boolean,
  image: String,
  createdAt: String,
  code: String,
});

export default mongoose.model("issue", Schema);
