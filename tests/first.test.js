const math = require('../src/math');


test('calculateTip', ()=>{
    expect(math.calculateTips(100, 30)).toBe(130);
})

test('test default tip percentage', ()=>{
    expect(math.calculateTips(100)).toBe(120)
})

test('F to C test', ()=>{
    expect(math.FtoC(32)).toBe(0);
})

test('C to F test', ()=>{
    expect(math.CtoF(0)).toBe(32);
})