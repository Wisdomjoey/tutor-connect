import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { roomName } = await req.json();

    if (!apiKey || !apiSecret) {
      return new NextResponse("LiveKit configuration missing", { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id,
      name: session.user.name || "Anonymous",
    });

    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

    const token = at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}