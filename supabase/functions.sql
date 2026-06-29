create or replace function public.match_transactions_by_inn()
returns int
language plpgsql
as $$
declare v_count int;
begin
  update bank_transactions bt
     set matched_company_id = c.id,
         match_method       = 'inn_exact',
         match_confidence   = 1.00,
         status             = 'matched',
         updated_at         = now()
    from companies c
   where bt.sender_inn = c.tax_id
     and bt.status = 'unmatched';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.get_expected_vs_actual(p_month date)
returns table (company_id uuid, company_name text,
               expected numeric, actual numeric, difference numeric)
language sql stable
as $$
  with b as (
    select date_trunc('month', p_month)::date as m_start,
           (date_trunc('month', p_month) + interval '1 month')::date as m_next
  ),
  expected as (
    select ct.company_id, sum(ct.monthly_amount) as expected
    from contracts ct, b
    where ct.start_date < b.m_next
      and (ct.end_date is null or ct.end_date >= b.m_start)
    group by ct.company_id
  ),
  actual as (
    select bt.matched_company_id as company_id, sum(bt.amount) as actual
    from bank_transactions bt, b
    where bt.status = 'matched'
      and bt.entry_date >= b.m_start
      and bt.entry_date <  b.m_next
    group by bt.matched_company_id
  )
  select c.id, c.name,
         coalesce(e.expected,0),
         coalesce(a.actual,0),
         coalesce(a.actual,0) - coalesce(e.expected,0)
  from companies c
  left join expected e on e.company_id = c.id
  left join actual   a on a.company_id = c.id
  where coalesce(e.expected,0) > 0 or coalesce(a.actual,0) > 0
  order by c.name;
$$;