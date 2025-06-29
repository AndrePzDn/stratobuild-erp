import DialogTemplate from '../template/DialogTemplate'
import { Button } from './button';
import { DialogDescription, DialogFooter } from './dialog';

interface Props {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  description?: string;
  handleOpen: () => void;
  handleOnConfirm: () => void;
  handleOnCancel: () => void;
}

export default function ConfirmationDialog({
  title = 'Estas seguro?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  description = 'Se eliminará el elemento seleccionado, esta acción no se puede deshacer.',
  isOpen = false,
  handleOpen,
  handleOnConfirm,
  handleOnCancel,
}: Props) {
  return (
    <DialogTemplate
      title={title}
      handleOpen={handleOpen}
      trigger={false}
      open={isOpen}
    >
      <DialogDescription>{description}</DialogDescription>
      <DialogFooter className='flex justify-end gap-2'>
        <Button variant='secondary' onClick={handleOnCancel}>{cancelText}</Button>
        <Button onClick={handleOnConfirm}>{confirmText}</Button>
      </DialogFooter>
    </DialogTemplate>
  )
}
