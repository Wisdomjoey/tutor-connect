"use server";

import { errorHandler } from "@/lib/handlers";
import { db } from "@/lib/prisma";
import { CommunitySchema, UseCommunitySchema } from "@/zod/schema";
import { authenticate } from "./auth";
import { STATUS } from "@prisma/client";
import { AccessToken } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

export const createCommunity = async (values: UseCommunitySchema) => {
  try {
    const { success, data } = CommunitySchema.safeParse(values);

    if (!success || !data)
      return {
        success: false,
        message: "Invalid field values passed",
      };

    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const { description, department, faculty, name } = data;
    const existingCommunity = await db.community.findUnique({
      where: { name },
    });

    if (existingCommunity)
      return {
        success: false,
        message: "This is already in use y another community",
      };

    const community = await db.community.create({
      data: {
        name,
        faculty,
        department,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        adminId: auth.session.user.id,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return {
      success: true,
      data: community,
      message: "Successfully created community",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const connectToCommunity = async (id: string) => {
  try {
    const auth = await authenticate();
    const userId = auth.session?.user.id;

    if (!auth.valid || !userId)
      return {
        success: false,
        message: "Session has expired",
      };
    if (!apiKey || !apiSecret)
      return {
        success: false,
        message: "Missing or Invalid Configurations",
      };

    const community = await db.community.findUnique({
      where: {
        id,
        OR: [
          { adminId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      select: { id: true, adminId: true },
    });

    if (!community)
      return {
        success: false,
        message:
          "You are not a member of this community or Community does not exist",
      };

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: auth.session?.user.fullname ?? "Anonymous",
    });

    at.addGrant({
      room: id,
      roomJoin: true,
      canPublish: true,
      roomCreate: true,
      canSubscribe: true,
      roomAdmin: userId === community.adminId,
    });

    return {
      success: true,
      data: await at.toJwt(),
      message: "Successfull",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const handleJoinRequest = async (
  id: string,
  communityId: string,
  status: STATUS
) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const community = await db.community.findUnique({
      where: { id: communityId, adminId: auth.session.user.id },
      select: { id: true },
    });

    if (!community)
      return {
        success: false,
        message: "You are not the owner of this community",
      };

    const request = await db.communityMember.update({
      where: { id, status: "PENDING" },
      data: { status },
    });

    return {
      success: true,
      data: request,
      message: "Successfully updated request",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const joinCommunity = async (id: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const community = await db.community.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!community)
      return {
        success: false,
        message: "This community does not exist",
      };

    const member = await db.communityMember.create({
      data: {
        communityId: community.id,
        userId: auth.session.user.id,
      },
    });

    return {
      success: true,
      data: member,
      message: "Successfully sent join request",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchCommunities = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const communities = await db.community.findMany({
      where: {
        members: {
          none: {
            userId: auth.session.user.id,
          },
        },
        NOT: {
          adminId: auth.session.user.id,
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return {
      success: true,
      data: communities,
      message: "Successfully fetched communities",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchCommunity = async (id: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const community = await db.community.findUnique({
      where: {
        id,
        OR: [
          { adminId: auth.session.user.id },
          {
            members: {
              some: {
                userId: auth.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        admin: true,
        files: { include: { user: { select: { fullname: true } } } },
        members: {
          include: {
            user: {
              select: {
                fullname: true,
                email: true,
              },
            },
          },
        },
        messages: {
          include: {
            user: {
              select: {
                fullname: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: community,
      message: "Successfully fetched community",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchMyCommunities = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const communities = await db.community.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                userId: auth.session.user.id,
              },
            },
          },
          { adminId: auth.session.user.id },
        ],
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return {
      success: true,
      data: communities,
      message: "Successfully fetched communities",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchMemberships = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const memberships = await db.communityMember.findMany({
      where: {
        userId: auth.session.user.id,
      },
    });

    return {
      success: true,
      data: memberships,
      message: "Successfully fetched memberships",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const sendMessage = async (id: string, message: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const community = await db.community.findUnique({
      where: {
        id,
        OR: [
          { adminId: auth.session.user.id },
          {
            members: {
              some: {
                userId: auth.session.user.id,
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    if (!community)
      return {
        success: false,
        message: "Community does not exist or you are not a member",
      };

    await db.communityMessage.create({
      data: {
        communityId: id,
        content: message,
        createdAt: new Date(),
        userId: auth.session.user.id,
      },
    });

    return {
      success: true,
      message: "Successfully sent message",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};
