"use server";

import { errorHandler } from "@/lib/handlers";
import { db } from "@/lib/prisma";
import { CommunitySchema, UseCommunitySchema } from "@/zod/schema";
import { authenticate } from "./auth";
import { STATUS } from "@prisma/client";

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
        messages: true,
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
