export const discord_api_version_url = "https://discord.com/api/v9";

export type access_token_response = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type users_discord_info_obj = {
  id: string;
  username: string;
  avatar: string;
  email: string;
  avatar_decoration: null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: null;
  banner_color: null;
  accent_color: null;
  locale: string;
  mfa_enabled: boolean;
  type: string;
  allowed: boolean;
};

export type multer_file = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
};

export type issues = {
  name: string;
  act: string;
  subAct: string;
  rarity: number;
  image: string;
  createdAt: string;
  old: boolean;
  code: string;
};

export const colors: any = {
  yellow: "#FFFF00",
  green: "#00ff00",
  red: "#ff0000",
};

export type embed = {
  title: string;
  type: string;
  description: string;
  url: string;
  timestamp: string;
  color: number | string;
  footer: { text: string; icon_url: string; proxy_icon_url: string };
  image: { url: string; proxy_url: string; height: number; width: number };
  author: {
    name: string;
    url: string;
    icon_url: string;
    proxy_icon_url: string;
  };
  fields: { name: string; value: string; inline: boolean };
};
