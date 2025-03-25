import { Input } from "../ui/input";
import { Label } from "../ui/label";

type DefaultInputProps = React.ComponentProps<typeof Input> & {
  id: string;
  label?: string;
};

function DefaultInput({ id, label, ...otherProps }: DefaultInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Input {...otherProps} id={id} />
    </div>
  );
}

export default DefaultInput;
