
// tree-shaking demo
export function a() {
    console.log(3245676);
    return b();
}

export function b() {
    return 'this is function "b"';
}

export function c() {
    return 'this is function "c"';
}


alert(883);
