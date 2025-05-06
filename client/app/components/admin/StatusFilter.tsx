import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { orderStatus } from '~/constant/order';
import { useSearchParams, useNavigate } from 'react-router';

export function StatusFilter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const current = searchParams.get('status') ?? '';

  function onChange(v: string) {
    const p = new URLSearchParams(searchParams);
    if (v === 'all') p.delete('status');
    else p.set('status', v);
    p.set('page', '1');
    navigate(`?${p}`);
  }

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {orderStatus.map(s => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}