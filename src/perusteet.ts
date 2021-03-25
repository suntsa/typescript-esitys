type Sotku = string

interface Eläin {
  nimi: string
}

interface PostinRepivä {
  reviPosti: () => Sotku
}

interface Koira extends Eläin, PostinRepivä {
  noutaa: boolean
}

interface Haukka extends Eläin {
  noutaa: boolean
}

interface Oksentava {
  oksennaKarvapallo: () => Sotku
}

// Ei laajenna Elain-rajapintaa vaan määrittelee kaikki sen kentät itse
interface Kissa extends Oksentava {
  nimi: string
  elämiä: number
}

/*
// Virhe, koska kenttä "nimi" puuttuu
const koira: Koira = {
  noutaa: true
}
*/

const jokuKissa: Kissa = {
  nimi: 'Anselmi',
  elämiä: 8,
  oksennaKarvapallo: (): Sotku => {
    return 'cxvzl,nasroiuhyxv'
  }
}
const jokuKoira: Koira = {
  nimi: 'Jeppe',
  noutaa: false,
  reviPosti: (): Sotku => {
    return 'w  it  idmr  kc r'
  }
}
const jokuHaukka: Haukka = {
  nimi: 'Katu',
  noutaa: true
}

const kelpaakoKoiraLintumetsälle = (koira: Koira): boolean => {
  return koira.noutaa
}
console.log(`Koira kelpaa lintumetsälle: ${kelpaakoKoiraLintumetsälle(jokuKoira)}`)
/*
// TS2345: Argument of type 'Kissa' is not assignable to parameter of type 'Koira'.
// Property 'noutaa' is missing in type 'Kissa' but required in type 'Koira'.
console.log(`Kissa kelpaa lintumetsälle: ${kelpaakoKoiraLintumetsälle(jokuKissa)}`)
 */

const kelpaakoEhkäNoutavaLintumetsälle = (ehkäNoutava: { noutaa: boolean }): boolean => {
  return ehkäNoutava.noutaa
}
console.log(`Ehkä noutava koira kelpaa lintumetsälle: 
${kelpaakoEhkäNoutavaLintumetsälle(jokuKoira)}`)
console.log(`Ehkä noutavat haukka kelpaa lintumetsälle: ${kelpaakoEhkäNoutavaLintumetsälle(jokuHaukka)}`)
/*
TS2345: Argument of type 'Kissa' is not assignable to parameter of type '{ noutaa: boolean; }'.
Property 'noutaa' is missing in type 'Kissa' but required in type '{ noutaa: boolean; }'.
console.log(`Kissa kelpaa lintumetsälle: ${kelpaakoLintumetsälle(jokuKissa)}`)
*/

const kutsuhuutoNimetylle = (nimetty: { nimi: string }): string => {
  return `Tänne ${nimetty.nimi}!`
}
const kutsuhuutoElaimelle = (elain: Eläin): string => {
  return `Tänne ${elain.nimi}!`
}
// Kissa kelpaa molempiin, koska se on rakenteellisesti yhteensopiva Elain-tyypin kanssa.
console.log(kutsuhuutoNimetylle(jokuKissa))
console.log(kutsuhuutoElaimelle(jokuKissa))

const onOksentava = (ehdokas: Object): ehdokas is Oksentava => {
  // in-tarkastelu on puhtaasti ajonaikaista joten tässä 'oksennaKarvapallo' ei liity mitenkään
  // Oksentava-tyypin samannimiseen kenttään
  return 'oksennaKarvapallo' in ehdokas
}

// Tässä parametrin tyyppinä union-tyyppi, joka tarkoittaa "joku näistä tyypeistä"
const tuotaSotkua = (sotkeva: Oksentava | PostinRepivä): Sotku => {
  if (onOksentava(sotkeva)) {
    // Kääntäjä "rajaa" tyypin onOksentava-funktion perusteella
    return sotkeva.oksennaKarvapallo()
  } else {
    // Kääntäjä tietää, että sotkeva-oliossa on pakko olla reviPosti-niminen kenttä.
    return sotkeva.reviPosti()
  }
}
console.log(`Koira sotkee: ${tuotaSotkua(jokuKoira)}`)
console.log(`Kissa sotkee: ${tuotaSotkua(jokuKissa)}`)

/*
// Javasta tuttu instanceof ei toimi
const tuotaSotkuaInstanceofYritelmä = (sotkeva: { oksennaKarvapallo: () => Sotku } | { reviPosti: () => Sotku }): Sotku => {
  // TS2693: 'Oksentava' only refers to a type, but is being used as a value here.
  if (sotkeva instanceof Oksentava) {
    // ...
  }
}
*/
