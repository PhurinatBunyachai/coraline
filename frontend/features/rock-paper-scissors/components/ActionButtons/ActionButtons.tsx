import { Button } from '@/components/Button/Button';
import { useActionButtons } from './ActionButtons.hook';
import type { Action } from '../../types/action.types';

interface ActionButtonsProps {
  onSelect: (action: Action) => void;
  disabled: boolean;
}

export function ActionButtons({ onSelect, disabled }: ActionButtonsProps) {
  const { actions } = useActionButtons({ onSelect, disabled });

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="shrink-0 text-sm sm:w-28">Your action:</span>
      <div className="flex flex-wrap gap-3 sm:gap-6">
        {actions.map((action) => (
          <Button
            key={action.value}
            type="button"
            variant="outline"
            disabled={action.disabled}
            onClick={action.onClick}
            className="h-20 w-20 rounded-none text-sm font-medium sm:h-32 sm:w-32"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
