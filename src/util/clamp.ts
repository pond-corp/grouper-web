
// luas math.clamp ported to ts

export default function (n: number, min: number, max: number) {
    return n > max? max : n < min? min : n
}