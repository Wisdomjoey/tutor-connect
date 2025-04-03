"use server";

import { errorHandler } from "@/lib/handlers";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import AWS from "aws-sdk";
import { v7 } from "uuid";

const client = new S3Client({
  region: process.env.AWS_REGION,
  // useDualstackEndpoint: true,
  // s3ForcePathStyle: true,
});

export const uploadFile = async (form: FormData) => {
  try {
    const files: File[] = [];
    const entries = form.entries();

    for (const [, value] of entries) {
      if (!(value instanceof File))
        return {
          success: false,
          message: "One of the fields is not a valid File Object",
        };

      files.push(value);
    }
console.log(files)
    const uploads: {
      name: string;
      url: string;
      key: string;
    }[] = [];
    const bucket = process.env.AWS_BUCKET_NAME ?? "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = `${v7()}.${file.name.split(".").pop()}`;

      await client.send(
        new PutObjectCommand({
          Key: key,
          Bucket: bucket,
          Body: Buffer.from(await file.arrayBuffer()),
        })
      );

      const url = await getSignedUrl(
        client,
        new GetObjectCommand({
          Key: key,
          Bucket: bucket,
        })
      );

      uploads.push({
        url: url.split("?")[0],
        name: file.name,
        key,
      });
    }

    return {
      success: true,
      data: uploads,
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};

export const deleteFile = async (keys: string[]) => {
  try {
    if (keys.length <= 0) return;

    await client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME ?? "",
        Delete: { Objects: [...keys.map((key) => ({ Key: key }))] },
      })
    );

    return {
      success: true,
    };
  } catch (error) {
    const err = errorHandler(error);

    return { ...err, success: false };
  }
};
