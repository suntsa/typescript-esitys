console.log('hola')

interface K1A {
    paikka: string
    celcius: number
    aika: Date
}
interface K1A_pakkasta {
    paikka: string
    pakkasta: boolean
    aika: Date
}
interface K1Z {
    paikka: string
    pakkasta: boolean
    pvm: string
}

const k1a: K1A = {
    paikka: "Teuva",
    celcius: -4,
    aika: new Date()
}

const muunna1 = <A, Z>(f1: (a: A) => Z): (a: A) => Z => (a) => f1(a)
const muunna2 = <A, B, Z>(f1: (a: A) => B, f2: (b: B) => Z): (a: A) => Z => (a) => f2(muunna1(f1)(a))

const amu1 = <A, Z>(a: A): (f1: (a: A) => Z) => Z => {
    return (f1) => f1(a)
}

const muunna_celcius_pakkasta = <AB>(a: { celcius: number } & AB): { pakkasta: boolean } & AB => {
    //const ab: AB = Object.assign({}, a, { fahr: undefined })
    const ab: AB = Object.assign({}, a, { celcius: undefined })
    return {
        ...ab,
        pakkasta: a.celcius < 0
    }
}

const muunna_aika_pvm = <AB>(a: { aika: Date } & AB): { pvm: string } & AB => {
    // Tässä { aika: undefined } ei ole tyyppiturvallinen.
    const ab: AB = Object.assign({}, a, { aika: undefined })
    return {
        ...ab,
        pvm: a.aika.toISOString()
    }
}
const muunna_aika_pvm_delete1 = <AB>(a: { aika: Date } & AB): { pvm: string } & AB => {
    const b: { aika: Date, pvm: string } & AB = {
        ...a,
        pvm: a.aika.toISOString()
    }
    delete b.aika
    return b
}
const muunna_aika_pvm_delete2 = <AB>(a: { aika: Date } & AB): { pvm: string } & AB => {
    const b = {
        ...a,
        pvm: a.aika.toISOString()
    }
    // Tässä delete on tyyppiturvallinen mutta ei edelleenkään pakollinen.
    delete b.aika
    return b
}
const k1z_delete2: K1Z = muunna2<K1A, K1A_pakkasta, K1Z>(muunna_celcius_pakkasta, muunna_aika_pvm_delete2)(k1a)
console.info("muunna_aika_pvm_delete2")
console.dir(k1z_delete2)

const korvaa = <A, P1 extends keyof A, S1 extends A[P1]>(a: A, kentta: P1, arvo: S1): A & { [kentta: string]: S1 } => {
    return {
        ...a,
        [kentta]: arvo
    }
}
const pudota = <A, P1 extends keyof A>(a: A, kentta: P1): Omit<A, P1> => {
    // return {
    //     ...a,
    //     [kentta]: undefined
    // }
    const b = { ...a }
    delete b[kentta]
    return b
}
const k1apudota = pudota(k1a, "aika")
const k1apudotatyypit = pudota<K1A, "aika">(k1a, "aika")
console.dir(k1apudota)


// const muunna_aika_pvm_pudota1 = <AB>(a: { aika: Date } & AB): { pvm: string } & AB => {
//     const ab: AB = pudota(a, "aika")
//     return {
//         ...ab,
//         pvm: a.aika.toISOString()
//     }
// }
const muunna_aika_pvm_pudota2 = <AB>(a: { aika: Date } & AB): { pvm: string } & AB => {
    return pudota(
        {
            ...a,
            pvm: a.aika.toISOString()
        },
        "aika") as unknown as { pvm: string } & AB
}
const k1z_pudot2: K1Z = muunna2<K1A, K1A_pakkasta, K1Z>(muunna_celcius_pakkasta, muunna_aika_pvm_pudota2)(k1a)
console.info("muunna_aika_pvm_pudota2")
console.dir(k1z_pudot2)


// const muunna_aika_pvm_O = <AB, A = { aika: Date } & AB, B = { pvm: string } & AB>(a: A): B => {
//     // const ab: AB = Object.assign({}, a, { aika: undefined })
//     const ab: Omit<A, "aika"> = Object.assign({}, a, { aika: undefined })

//     return {
//         ...(ab as unknown as AB),
//         pvm: a.aika.toISOString() as string
//     }
// }

// const muunna_aika_pvm_O2 = <AB, A = { aika: Date } & AB, B = { pvm: string } & AB>(a: A): B => {
//     return {
//         ...a,
//         aika: undefined,
//         pvm: a.aika.toISOString()
//     }
// }

const k1a_pakkasta: K1A_pakkasta = muunna1(muunna_celcius_pakkasta)(k1a)
console.dir(k1a_pakkasta)
const k1z_pakkasesta: K1Z = muunna1(muunna_aika_pvm)(k1a_pakkasta)
const k1z_3: K1Z = amu1<K1A_pakkasta, K1Z>(k1a_pakkasta)(muunna_aika_pvm)

// const k1z: K1Z = muunna2(muunna_celcius_pakkasta, muunna_aika_pvm)(k1a)
const k1z4: K1Z = muunna2<K1A, K1A_pakkasta, K1Z>(muunna_celcius_pakkasta, muunna_aika_pvm)(k1a)
console.dir(k1z4)
// const k1z2: K1Z = muunna2(muunna_celcius_pakkasta, (b: K1A_pakkasta) => muunna_aika_pvm(b))(k1a)
