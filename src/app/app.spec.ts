import { describe, expect, it } from 'vitest';
import { STATUS_LABEL, brl, isoDate, nextDays, normalizePhone } from './core/format';

describe('format', () => {
  it('formata valores em reais', () => {
    expect(brl(90).replace(/\s/g, ' ')).toBe('R$ 90,00');
  });

  it('gera dias consecutivos no fuso de São Paulo', () => {
    const days = nextDays(new Date('2026-03-15T15:00:00Z'), 3);
    expect(days.map((d) => d.iso)).toEqual(['2026-03-15', '2026-03-16', '2026-03-17']);
    expect(days[1].day).toBe(16);
  });

  it('usa a data de São Paulo mesmo perto da meia-noite UTC', () => {
    expect(isoDate(new Date('2026-03-16T01:30:00Z'))).toBe('2026-03-15');
  });

  it('acrescenta o DDI 55 quando o telefone vem só com DDD', () => {
    expect(normalizePhone('(11) 98888-7777')).toBe('5511988887777');
    expect(normalizePhone('+55 11 98888-7777')).toBe('5511988887777');
  });

  it('tem rótulo para todos os status', () => {
    expect(Object.keys(STATUS_LABEL)).toHaveLength(6);
  });
});
