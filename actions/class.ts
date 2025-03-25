"use server";

import { errorHandler } from "@/lib/handlers";
import { db } from "@/lib/prisma";
import { ClassSchema, UseClassSchema } from "@/zod/schema";
import { authenticate } from "./auth";

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
