"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { Material } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import Spinner from "./widgets/Spinner";
import { fetchClassMaterials, uploadClassFile } from "@/actions/class";

interface MaterialsListProps {
  classId: string;
  tutorId: string;
}

export function MaterialsList({ classId, tutorId }: MaterialsListProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  const fetch = useCallback(async () => {
    const { message, success, data } = await fetchClassMaterials(classId);

    if (data) setMaterials(data);

    intervalRef.current = setInterval(fetch, 60000);

    toast({
      description: message,
      variant: success ? "default" : "destructive",
    });

    setLoading(false);
  }, [classId, toast]);

  const handleFiles = (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);

      if (!file) continue;

      const limit = 1000 * 1024;

      if (file.size > limit) {
        return toast({
          description: "One of the files has exceeded size limit of 1mb",
          variant: "destructive",
        });
      }

      setFiles((prev) => [...prev, file]);
    }
  };

  const handleSubmit = async () => {
    if (files.length <= 0) return;

    setLoading(true);

    const form = new FormData();

    files.forEach((file, ind) => form.append(ind.toString(), file));

    const { message, success } = await uploadClassFile(classId, form);

    if (intervalRef.current) clearInterval(intervalRef.current);

    await fetch();

    toast({
      description: message,
      variant: success ? "default" : "destructive",
    });
  };

  useEffect(() => {
    fetch();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetch]);

  if (loading)
    return (
      <div className="py-10">
        <Spinner borderColor="border-primary" />
      </div>
    );

  if (materials.length <= 0)
    return (
      <div className="py-10">
        <p>There are currently no uploaded files</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {session?.user.id === tutorId && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-4"
        >
          <Input
            required
            type="file"
            disabled={loading}
            className="min-w-40"
            id="file-upload"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <Button type="submit">
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </span>
          </Button>
        </form>
      )}

      <div className="space-y-5">
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg">Uploaded</h3>

            {files.map((material, ind) => (
              <div
                key={ind}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{material.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-base sm:text-lg">Class Files</h3>

          {materials.map((material, ind) => (
            <div
              key={ind}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{material.name}</span>
              </div>

              <Button asChild>
                <a
                  target="_blank"
                  href={material.url}
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
