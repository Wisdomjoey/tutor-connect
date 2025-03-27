"use server";

import { errorHandler } from "@/lib/handlers";
import { db } from "@/lib/prisma";
import { ClassSchema, UseClassSchema } from "@/zod/schema";
import { authenticate } from "./auth";
import { generateToken } from "@/lib/utils";
import { AccessToken } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

const generateAndFindToken = async () => {
  const token = generateToken();
  const invite = await db.inviteToken.findUnique({
    where: { token },
    select: { id: true },
  });

  return { invite, token };
};

export const connectToClass = async (id: string) => {
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

    const _class = await db.class.findUnique({
      where: {
        id,
        OR: [
          { tutorId: userId },
          {
            enrollments: {
              some: {
                studentId: userId,
              },
            },
          },
        ],
      },
      select: { id: true, tutorId: true },
    });

    if (!_class)
      return {
        success: false,
        message: "This class doesn't exist or your are not enrolled in it",
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
      roomAdmin: userId === _class?.tutorId,
    });

    return {
      success: true,
      data: at.toJwt(),
      message: "Successfull",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const createClass = async (values: UseClassSchema) => {
  try {
    const { success, data } = ClassSchema.safeParse(values);

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

    const {
      max,
      date,
      time,
      title,
      faculty,
      duration,
      department,
      description,
    } = data;
    const formatted = new Date(`${date} ${time}`);

    if (formatted < new Date())
      return {
        success: false,
        message: "Scheduled Date for a class must be a future time",
      };

    const hours = Math.ceil(parseFloat(duration));
    const end = new Date(formatted.getTime() + hours * 60 * 60 * 1000);

    const classData = await db.class.create({
      data: {
        end,
        title,
        faculty,
        department,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        tutorId: auth.session.user.id,
        date: new Date(`${date} ${time}`),
        duration: Math.ceil(parseFloat(duration)),
        maxStudents: max ? Math.floor(parseFloat(max)) : 20,
      },
    });

    return {
      success: true,
      data: classData,
      message: "Successfully created class",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const enrollInClass = async (id: string, token: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const invite = await db.inviteToken.findUnique({
      where: {
        token,
        classId: id,
      },
    });

    if (!invite)
      return {
        success: false,
        message: "Invalid invitation",
      };

    if (new Date(invite.expires) <= new Date())
      return {
        success: false,
        message: "Invitation has expired",
      };

    const _class = await db.class.findUnique({
      where: {
        id,
      },
    });

    if (!_class)
      return {
        success: false,
        message: "This class does not exist",
      };

    const enrollment = await db.enrollment.findFirst({
      where: {
        classId: id,
        studentId: auth.session.user.id,
      },
    });

    if (enrollment)
      return {
        success: false,
        message: "You've already enrolled for this class",
      };

    await Promise.all([
      db.inviteToken.delete({ where: { id: invite.id } }),
      db.enrollment.create({
        data: {
          classId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: auth.session.user.id,
        },
      }),
    ]);

    const updatedClass = await db.class.findUnique({
      where: {
        id,
      },
      include: {
        tutor: {
          select: {
            id: true,
            fullname: true,
            phone: true,
          },
        },
        enrollments: true,
      },
    });

    return {
      data: updatedClass,
      success: true,
      message: "You've successfully enrolled for this class",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchClass = async (id: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const class_ = await db.class.findUnique({
      where: {
        id,
      },
      include: {
        tutor: {
          select: {
            id: true,
            fullname: true,
            phone: true,
          },
        },
        enrollments: true,
      },
    });

    return {
      success: true,
      data: class_,
      message: "Successfully fetched class",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchOngoingClasses = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const classes = await db.class.findMany({
      where: {
        date: {
          lte: new Date(),
        },
        end: {
          gt: new Date(),
        },
        OR: [
          { tutorId: auth.session.user.id },
          {
            enrollments: {
              some: {
                studentId: auth.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    return {
      success: true,
      data: classes,
      message: "Successfully fetched classes",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchUpcomingClasses = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const classes = await db.class.findMany({
      where: {
        date: {
          gt: new Date(),
        },
        OR: [
          { tutorId: auth.session.user.id },
          {
            enrollments: {
              some: {
                studentId: auth.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    return {
      success: true,
      data: classes,
      message: "Successfully fetched classes",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const fetchPastClasses = async () => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    const classes = await db.class.findMany({
      where: {
        date: {
          lt: new Date(),
        },
        end: {
          lte: new Date(),
        },
        OR: [
          { tutorId: auth.session.user.id },
          {
            enrollments: {
              some: {
                studentId: auth.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    return {
      success: true,
      data: classes,
      message: "Successfully fetched classes",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const generateInvitation = async (id: string) => {
  try {
    const auth = await authenticate();

    if (!auth.valid || !auth.session?.user.id)
      return {
        success: false,
        message: "Session has expired",
      };

    let data = await generateAndFindToken();

    while (data.invite) {
      data = await generateAndFindToken();
    }

    await db.inviteToken.create({
      data: {
        classId: id,
        token: data.token,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return {
      success: true,
      data: `${process.env.NEXT_PUBLIC_BASE_URL}/${id}?token=${data.token}`,
      message: "Link generated! This link will expire in 15 minutes",
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};
