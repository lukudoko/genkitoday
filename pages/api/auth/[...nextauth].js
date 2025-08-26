import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const config = {
  runtime: 'nodejs',
};

export default NextAuth(authOptions);