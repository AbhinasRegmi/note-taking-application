import { slugify } from './slug';

describe('slugify', () => {
  it('should return a slugified string', () => {
    const first = 'Hello World';
    const firstResult = slugify(first);

    expect(firstResult).toBe('hello-world');
    
    const second = 'Hello World 7 8 9';
    const secondResult = slugify(second);
    
    expect(secondResult).toBe('hello-world-7-8-9');
  });
});
