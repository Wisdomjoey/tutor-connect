import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaInputProps = React.ComponentProps<typeof Textarea> & {
  id: string;
  label?: string;
};

function TextAreaInput({ id, label, ...otherProps }: TextAreaInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Textarea rows={3} {...otherProps} id={id} />
    </div>
  );
}

export default TextAreaInput;
