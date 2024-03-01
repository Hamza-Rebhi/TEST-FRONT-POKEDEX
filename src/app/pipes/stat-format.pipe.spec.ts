import { StatFormatPipe } from './stat-format.pipe';

describe('StatFormatPipe', () => {
  let pipe: StatFormatPipe;

  beforeEach(() => {
    pipe = new StatFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "hp" to "HP"', () => {
    const transformedValue = pipe.transform('hp');
    expect(transformedValue).toEqual('HP');
  });

  it('should transform "attack" to "ATK"', () => {
    const transformedValue = pipe.transform('attack');
    expect(transformedValue).toEqual('ATK');
  });

  it('should transform "defense" to "DEF"', () => {
    const transformedValue = pipe.transform('defense');
    expect(transformedValue).toEqual('DEF');
  });

  it('should transform "special-attack" to "SATK"', () => {
    const transformedValue = pipe.transform('special-attack');
    expect(transformedValue).toEqual('SATK');
  });

  it('should transform "special-defense" to "SDEF"', () => {
    const transformedValue = pipe.transform('special-defense');
    expect(transformedValue).toEqual('SDEF');
  });

  it('should transform "speed" to "SPD"', () => {
    const transformedValue = pipe.transform('speed');
    expect(transformedValue).toEqual('SPD');
  });

  it('should return the value unchanged if not matched', () => {
    const transformedValue = pipe.transform('unknown');
    expect(transformedValue).toEqual('unknown');
  });
});
