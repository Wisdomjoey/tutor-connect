import { cn } from "@/lib/utils";

function Spinner({
  borderColor,
  className,
  width,
}: {
  borderColor?: string;
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={cn("size-full flex items-center justify-center", className)}
    >
      <div
        className={`animate-spin aspect-square ${
          width ?? "w-10"
        } rounded-[50%] border-4 ${
          borderColor ?? "border-primary-foreground"
        } border-l-[transparent]`}
      ></div>
    </div>
  );
}

export default Spinner;
