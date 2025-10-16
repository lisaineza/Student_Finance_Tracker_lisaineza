import { compileRegex } from './validators.js';

export function applySearch(rows, pattern, flags){
  const re = compileRegex(pattern, flags);
  if (!re) return { rows, re:null, invalid: !!pattern };
  return {
    rows: rows.filter(r =>
      re.test(r.description) || re.test(r.category) || re.test(r.date) || re.test(String(r.amount))
    ),
    re,
    invalid:false
  };
}
