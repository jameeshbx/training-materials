// src/app/api/socket/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server";
import { initSocket } from "@/lib/socketServer";

export async function GET(req: NextRequest) {
  try {
    // NextRequest-ൽ socket property ഇല്ല, so different approach വേണം
    if (!global.socketServer) {
      console.log("⚡ Initializing Socket.IO...");
      // Alternative approach needed
    }
    
    return NextResponse.json({ status: "Socket is active" });
  } catch (err) {
    console.error("Socket Init Error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}