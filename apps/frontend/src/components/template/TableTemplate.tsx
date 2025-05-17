import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  convertEntity,
  deleteEntity,
  listEntity,
  patchEntity,
  postEntity,
} from "@/utils/connections";
import { useAuthStore } from "@/stores/authStore";
import FormDialog from "@/pages/Client/components/FormDialog";
import type z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { normalizeItemToEdit } from "@/utils/normalizeFields";

interface TableHeadProps {
  label: string;
  name: string;
  type?: string;
}

interface ConfigProps {
  tableHead: TableHeadProps[];
  labelName: string;
}

interface Props<T extends z.ZodTypeAny> {
  entity: string;
  config: ConfigProps;
  canBeCreated?: boolean;
  editable?: boolean;
  convertible?: boolean;
  deletable?: boolean;
  form?: ReactNode;
  schema?: T;
  dialogSize?: "default" | "sm" | "lg" | "xl";
  normalizeFields?: string[];
}

interface TableRowActionsProps {
  item: any;
  onDelete?: (item: any) => void;
  onEdit?: (item: any) => void;
  onConvert?: (item: any) => void;
  deletable?: boolean;
  editable?: boolean;
  convertible?: boolean;
}

function TableRowActions({
  item,
  onDelete,
  onEdit,
  onConvert,
  deletable = true,
  editable = true,
  convertible = false,
}: TableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <EllipsisVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {editable && (
          <DropdownMenuItem onClick={() => onEdit?.(item)}>
            Editar
          </DropdownMenuItem>
        )}
        {convertible && (
          <DropdownMenuItem onClick={() => onConvert?.(item)}>
            Convertir
          </DropdownMenuItem>
        )}
        {deletable && (
          <>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete?.(item)}
            >
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TableTemplate<T extends z.ZodTypeAny>({
  entity,
  config,
  canBeCreated = true,
  editable = false,
  convertible = false,
  deletable = true,
  form,
  schema,
  dialogSize = "default",
  normalizeFields,
}: Props<T>) {
  const haveOptions = editable || convertible || deletable;
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const { token } = user;
    const res = await listEntity(entity, 1, 100, token);
    setItems(res.data.result);
  }, [entity, user]);

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const handleCreate = async (data: z.infer<T>) => {
    if (!user) return;

    const { token } = user;
    const res = await postEntity(entity, data, token);
    console.log(await res.data);

    if (!res.data.success) return;

    setOpenCreateDialog(false);
    fetchData();
  };

  const handleDelete = async (item: any) => {
    if (!user) return;

    const { token } = user;
    const res = await deleteEntity(entity, item._id, token);
    console.log(await res.data);

    fetchData();
  };

  const handleEdit = (item: any) => {
    setItemToEdit(item);
    setOpenEditDialog(true);
  };

  const handleUpdate = async (data: z.infer<T>) => {
    if (!user || !itemToEdit) return;

    const { token } = user;
    const res = await patchEntity(entity, itemToEdit._id, data, token);

    if (!res.data.success) return;

    setOpenEditDialog(false);
    setItemToEdit(null);
    fetchData();
  };

  const handleConvert = async (item: any) => {
    if (!user) return;
    const res = await convertEntity(entity, item._id, user._id, user.token);
    console.log(await res.data);

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{`Lista de ${config.labelName}`}</h1>
        {canBeCreated && schema && (
          <FormDialog
            schema={schema}
            buttonLabel={`Agregar ${config.labelName}`}
            title={`Agregar ${config.labelName}`}
            buttonIcon={<Plus />}
            onSubmit={handleCreate}
            open={openCreateDialog}
            handleOpen={() => setOpenCreateDialog(!openCreateDialog)}
            size={dialogSize}
          >
            {form}
          </FormDialog>
        )}
      </nav>

      <div className="p-4 border border-black/20 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {config.tableHead.map((header, i) => (
                <TableHead key={i} className="font-semibold">
                  {header.label}
                </TableHead>
              ))}
              {haveOptions && <TableHead className="w-16" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                {config.tableHead.map((header, i) => (
                  <TableCell
                    key={i}
                    className="max-w-3xs whitespace-normal break-words"
                  >
                    {getNestedValue(item, header.name)}
                  </TableCell>
                ))}
                {haveOptions && (
                  <TableCell className="flex justify-end gap-2 w-fit">
                    <TableRowActions
                      item={item}
                      onDelete={deletable ? handleDelete : undefined}
                      onEdit={editable ? handleEdit : undefined}
                      onConvert={convertible ? handleConvert : undefined}
                      deletable={deletable}
                      editable={editable}
                      convertible={convertible}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editable && schema && (
        <FormDialog
          schema={schema}
          title={`Editar ${config.labelName}`}
          onSubmit={handleUpdate}
          initialData={normalizeItemToEdit(itemToEdit, normalizeFields)}
          open={openEditDialog}
          trigger={false}
          handleOpen={() => {
            setOpenEditDialog(false);
            setItemToEdit(null);
          }}
          size={dialogSize}
        >
          {form}
        </FormDialog>
      )}
    </div>
  );
}
