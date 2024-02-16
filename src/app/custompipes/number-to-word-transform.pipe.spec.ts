import { NumberToWordTransformPipe } from './number-to-word-transform.pipe';

describe('NumberToWordTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToWordTransformPipe();
    expect(pipe).toBeTruthy();
  });
});
