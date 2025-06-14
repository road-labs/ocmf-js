import { describe, expect, it } from '@jest/globals';
import { decomposeValue, parseSections } from '../src';

describe('decomposeValue', () => {
  it('returns decomposed sections for a valid value', () => {
    const { header, payloadData, signature } = decomposeValue(
      'OCMF|data|signature'
    );
    expect(header).toEqual('OCMF');
    expect(payloadData).toEqual('data');
    expect(signature).toEqual('signature');
  });

  it.each([
    {
      name: 'too few segments',
      value: 'OCMF|data',
    },
    {
      name: 'wrong header segment',
      value: 'FOO|data|signature',
    },
    {
      name: 'empty data payload segment',
      value: 'OCMF||signature',
    },
    {
      name: 'empty signature segment',
      value: 'OCMF|data|',
    },
  ])('throws when $name', ({ value }) => {
    expect(() => decomposeValue(value)).toThrow();
  });
});

describe('parseSections', () => {
  it('parses the sections', () => {
    const { header, payloadData, signature } = parseSections({
      header: 'OCMF',
      payloadData: '{"FV":"1.0"}',
      signature: '{"SD":"ABC"}',
    });
    expect(header).toEqual('OCMF');
    expect(payloadData).toEqual({ FV: '1.0' });
    expect(signature).toEqual({ SD: 'ABC' });
  });

  it('throws on invalid json in the data section', () => {
    expect(() =>
      parseSections({
        header: 'OCMF',
        payloadData: '{',
        signature: '{"SD":"ABC"}',
      })
    ).toThrow();
  });

  it('throws on invalid json in the signature section', () => {
    expect(() =>
      parseSections({
        header: 'OCMF',
        payloadData: '{"FV":"1.0"}',
        signature: '{',
      })
    ).toThrow();
  });
});
