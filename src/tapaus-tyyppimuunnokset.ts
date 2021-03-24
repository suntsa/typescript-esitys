//
// Lähtötyypit (näistä muunnetaan)
//
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

//
// Tulostyypit (nämä on muunnoksien ulostuloja)
//
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
 *
 * Tässä tyyppi "AZ" tarkoittaa kaikkia niitä kenttiä, joihin muunnos ei koske.
 * "&"-merkki tarkoittaa intersection-tyyppiä eli kahden tyypin yhdistettä.
 *
 * Sisään: AZ
 * Ulos:  { mittausTyyppi: MittausTyyppi } & AZ
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
 * Sisään: { mittalaite: Mittalaite } & AZ
 * Ulos:   { mittalaite: string } & AZ
 */
const muunna_mittalaite_mittalaitemalli = <AZ> (a: { mittalaite: Mittalaite } & AZ): ({ mittalaite: string } & AZ) => {
  return {
    ...a,
    mittalaite: a.mittalaite.malli
  }
}
/**
 * Muuntaa kentän nimen ja tyypin.
 * Sisään: { id: number } & AZ
 * Ulos:   { raportointiId: number } & AZ
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
  mittalaite: { id: 1234, malli: 'Elohopea' }
}
const jokuKosteusMittaus: KosteusMittaus = {
  rh: 56,
  id: 1002,
  mittalaite: { id: 4321, malli: 'Hius' }
}

// Esimerkki muunnosfunktion käytöstä yhden muunnoksen suorittamiseen
const jokuLämpötilaMittausTyypillä: LämpötilaMittaus & { mittausTyyppi: MittausTyyppi } =
    lisaa_mittaustyyppi<LämpötilaMittaus>('lämpötila')(jokuLämpötilaMittaus)
console.dir(jokuLämpötilaMittausTyypillä)
// Tulos:
// {
//   celcius: -18,
//   id: 1001,
//   mittalaite: { id: 1234, malli: 'Elohopea' },
//   mittausTyyppi: 'lämpötila'
// }

// Muunnosten ketjuttamiseen tarvitaan apufunktioita.

// Tyyppi muunnos A -> Z
type Muunnos<A, Z> = (a: A) => Z

// Muunnos A -> Z
const muunna1 = <A, Z> (f1: (a: A) => Z): Muunnos<A, Z> => (a) => f1(a)

// Muunnos A (-> B) -> Z
const muunna2 = <A, B, Z> (f1: (a: A) => B, f2: (b: B) => Z): Muunnos<A, Z> => (a) => f2(muunna1(f1)(a))

// Muunnos A (-> B -> C) -> Z
const muunna3 = <A, B, C, Z> (f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => Z): Muunnos<A, Z> => (a) => f3(muunna2(f1, f2)(a))

// Muunnosfunktio joka muuntaa LämpötilaMittaus-olion RaportointiLämpötilaMittaus-olioksi
const muunnaRaportointiLämpötilamittaukseen: Muunnos<LämpötilaMittaus, RaportointiLämpötilaMittaus> =
    muunna3(
        lisaa_mittaustyyppi('lämpötila'),
        muunna_id_raportointiId,
        muunna_mittalaite_mittalaitemalli)

// Sama kosteusmittaukselle
const muunnaRaportointiKosteusmittaukseen: Muunnos<KosteusMittaus, RaportointiKosteusMittaus> =
    muunna3(
        lisaa_mittaustyyppi('kosteus'),
        muunna_id_raportointiId,
        muunna_mittalaite_mittalaitemalli)

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
