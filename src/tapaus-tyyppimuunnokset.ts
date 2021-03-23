interface Mittalaite {
  id: number
  malli: string
}

interface Mittaus {
  id: number
  mittalaite: Mittalaite
}

interface LämpötilaMittaus extends Mittaus {
  celcius: number
}

interface KosteusMittaus extends Mittaus {
  rh: number
}

type MittausTyyppi = 'lämpötila' | 'kosteus' | 'uv'

interface RaportointiMittaus {
  mittausTyyppi: MittausTyyppi
  raportointiId: number
  /**
  Mittalaitteen mallinimi
   */
  mittalaite: string
}

interface RaportointiLämpötilaMittaus extends RaportointiMittaus {
  celcius: number
}

interface RaportointiKosteusMittaus extends RaportointiMittaus {
  rh: number
}

/**
 * Lisää uuden kentän.
 */
const lisaa_mittaustyyppi = <AZ> (tyyppi: MittausTyyppi): (a: AZ) => ({ mittausTyyppi: MittausTyyppi } & AZ) => {
  return (a) => {
    return {
      ...a,
      mittausTyyppi: tyyppi
    }
  }
}
/**
 * Muuntaa kentän tyypin
 */
const muunna_mittalaite_mittalaitemalli = <AZ> (a: { mittalaite: Mittalaite } & AZ): ({ mittalaite: string } & AZ) => {
  return {
    ...a,
    mittalaite: a.mittalaite.malli
  }
}
/**
 * Muuntaa kentän nimen ja tyypin.
 */
const muunna_id_raportointiId = <AZ> (a: { id: number } & AZ): ({ raportointiId: number } & AZ) => {
  const z = {
    // Tässä tulee vielä id-kenttä mukana...
    ...a,
    raportointiId: a.id
  }
  // ...joten poistetaan se tässä.
  delete z.id
  return z
}

const jokuLämpötilaMittaus: LämpötilaMittaus = {
  celcius: -18,
  id: 1001,
  mittalaite: {
    id: 1234,
    malli: 'Elohopea'
  }
}
const jokuKosteusMittaus: KosteusMittaus = {
  rh: 56,
  id: 1002,
  mittalaite: {
    id: 4321,
    malli: 'Hius'
  }
}
type Muunnos<A, Z> = (a: A) => Z
const muunna1 = <A, Z> (f1: (a: A) => Z): Muunnos<A, Z> => (a) => f1(a)
const muunna2 = <A, B, Z> (f1: (a: A) => B, f2: (b: B) => Z): Muunnos<A, Z> => (a) => f2(muunna1(f1)(a))
const muunna3 = <A, B, C, Z> (f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => Z): Muunnos<A, Z> => (a) => f3(muunna2(f1, f2)(a))

// const jokuLämpötilaTallennushetkellä2: LämpötilaMittaus & { tallennusHetki: Date } =
//     lisaa_tallennusHetki<LämpötilaMittaus>(new Date())(jokuLämpötilaMittaus)
// const m2: Muunnos<LämpötilaMittaus, LämpötilaMittaus & { tallennusHetki: Date }> = muunna1(lisaa_tallennusHetki(new Date()))

// const jokuLämpötilaTallennushetkellä: LämpötilaMittaus & { tallennusHetki: Date } = m2(jokuLämpötilaMittaus)

// const muunnos: Muunnos<Mittaus, RaportointiMittaus> = undefined

// const muunnos = muunna3(lisaa_tallennusHetki, muunna_id_raportointiId, muunna_mittalaite_mittalaiteId)
// const jokuRaportointiLämpötila: RaportointiLämpötilaMittaus = muunnos(jokuLämpötila)


const muunnaRaportointiLämpötilamittaukseen: Muunnos<LämpötilaMittaus, RaportointiLämpötilaMittaus> =
    muunna3(lisaa_mittaustyyppi('lämpötila'), muunna_id_raportointiId, muunna_mittalaite_mittalaitemalli)

const muunnaRaportointiKosteusmittaukseen: Muunnos<KosteusMittaus, RaportointiKosteusMittaus> =
    muunna3(lisaa_mittaustyyppi('kosteus'), muunna_id_raportointiId, muunna_mittalaite_mittalaitemalli)

console.dir(jokuLämpötilaMittaus)
console.dir(muunnaRaportointiLämpötilamittaukseen(jokuLämpötilaMittaus))
console.dir(jokuKosteusMittaus)
console.dir(muunnaRaportointiKosteusmittaukseen(jokuKosteusMittaus))

/*
// Kotitehtävä: kerro Mikolle miten tehdä muunnoksia niin ettei jokaiselle tyyppiparille tarvitse tehdä omaa muunnosfunktiota?

// Vinkki: Tämä ei toimi
function raportointiMittausMuunnos <M extends Mittaus, RM extends RaportointiMittaus>(tyyppi: MittausTyyppi): Muunnos<M, RM> {
  // '{ mittalaite: string; } & { raportointiId: number; } & { mittausTyyppi: MittausTyyppi; } & M' is assignable
  // to the constraint of type 'RM', but 'RM' could be instantiated with a different subtype of constraint
  // 'RaportointiMittaus'.
  return muunna3(lisaa_mittaustyyppi(tyyppi), muunna_id_raportointiId, muunna_mittalaite_mittalaitemalli)
}
*/
