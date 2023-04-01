import mongoose from "mongoose";

interface Cards {
  name: string;
  act: string;
  rarity: number;
  code: string;
  owner: string;
  time: string;
  image: string;
  xp: number;
}

const Schema = new mongoose.Schema<Cards>({
  name: String,
  act: String,
  rarity: Number,
  code: String,
  owner: String,
  time: String,
  image: String,
  xp: Number,
});

export default mongoose.model("cards", Schema);
