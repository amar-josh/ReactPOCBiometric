import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IFormDetailsSchema } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

interface ReadonlyFieldCardProps {
  title: string;
  fields: IFormDetailsSchema[];
}

const ReadonlyFieldCard = ({ title, fields }: ReadonlyFieldCardProps) => {
  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((ele, idx) => (
          <div key={`${title}-${idx}`}>
            <Label className="text-primary-gray">{translator(ele.label)}</Label>
            <p className="text-base text-gray-900 mt-1">
              {ele.type === "textarea" ? (
                <Textarea
                  className="bg-gray-100 text-gray-500 cursor-not-allowed border rounded-md p-2 resize-none"
                  disabled
                  value={
                    ele.defaultValue as
                      | string
                      | number
                      | readonly string[]
                      | undefined
                  }
                />
              ) : (
                <Input
                  className="bg-gray-100 text-gray-500 cursor-not-allowed border rounded-md p-2"
                  type={ele.type}
                  disabled
                  value={
                    ele.defaultValue as
                      | string
                      | number
                      | readonly string[]
                      | undefined
                  }
                />
              )}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReadonlyFieldCard;
