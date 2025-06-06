import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputFormField } from "@/components/ui/input-form-field";
import { SelectFormField } from "@/components/ui/select-form-field";
import useFetchData from "@/hooks/useFetchEntityData";
import type { PriceBank, Provider } from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useWatch, type Control } from "react-hook-form";

interface BudgetFieldValuesProps {
  control: Control;
  index: number;
  remove: (index: number) => void;
}

export default function BudgetItems({
  control,
  index,
  remove,
}: BudgetFieldValuesProps) {
  const { data: priceBank } = useFetchData<PriceBank>("priceBank");

  const [provider, setProvider] = useState<Provider>();
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const quantity = useWatch({ control, name: `items.${index}.quantity` });
  const priceBankId = useWatch({ control, name: `items.${index}.priceBank` });

  useEffect(() => {
    if (!priceBank || priceBank.length === 0) {
      setProvider(undefined);
      setUnitPrice(0);
      return;
    }
    const selectedPriceBank = priceBank.find((p) => p._id === priceBankId);

    if (!selectedPriceBank) {
      setProvider(undefined);
      setUnitPrice(0);
      return;
    }

    setProvider(selectedPriceBank.provider);
    setUnitPrice(selectedPriceBank.unitPrice);
  }, [priceBankId, priceBank]);

  useEffect(() => {
    if (typeof quantity === "number" && priceBankId) {
      const price =
        priceBank.find((p) => p._id === priceBankId)?.unitPrice || 0;
      const newTotal = quantity * price;
      setTotal(newTotal);
    } else {
      setTotal(0);
    }
  }, [priceBank, priceBankId, quantity]);

  return (
    <>
      <div className="col-span-6 items-start">
        <SelectFormField
          control={control}
          label=""
          name={`items.${index}.priceBank`}
          placeholder="Selecciona un Recurso"
          options={priceBank.map((client) => ({
            label: client.resource.name,
            value: client._id,
          }))}
        />
      </div>
      <div className="col-span-5 items-start">
        <Input
          className="mt-2"
          readOnly
          disabled
          value={provider?.name || ""}
        />
      </div>
      <div className="col-span-4 items-start">
        <Input className="mt-2" readOnly disabled value={unitPrice} />
      </div>
      <div className="col-span-4 items-start">
        <InputFormField
          control={control}
          label=""
          name={`items.${index}.quantity`}
          type="number"
        />
      </div>
      <div className="col-span-4 items-start">
        <Input className="mt-2" readOnly disabled value={total} />
      </div>
      <div className="col-span-1 flex justify-end self-start mt-2">
        <Button
          type="button"
          variant="destructive"
          onClick={() => remove(index)}
        >
          <Trash2 />
        </Button>
      </div>
    </>
  );
}
