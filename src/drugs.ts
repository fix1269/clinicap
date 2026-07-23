export interface Drug {
  brand: string;
  activeSubstance: string;
  category: string;
  priceEGP: number;
  alternatives: string[];
}

export const drugs: Drug[] = [
  {
    brand: "Antinal",
    activeSubstance: "Nifuroxazide",
    category: "مضاد إسهال",
    priceEGP: 18,
    alternatives: ["Ecofural", "Diarol", "Nifuroxazide Generic"],
  },
  {
    brand: "Gastreg",
    activeSubstance: "Alginic Acid + Sodium Bicarbonate",
    category: "مضاد حموضة",
    priceEGP: 35,
    alternatives: ["Gaviscon", "Topaal", "Acidin"],
  },
  {
    brand: "Controloc",
    activeSubstance: "Pantoprazole",
    category: "مثبط حموضة (PPI)",
    priceEGP: 65,
    alternatives: ["Pantoloc", "Pantop", "Nolpaza"],
  },
  {
    brand: "Spasmo-Canulase",
    activeSubstance: "Hyoscine + Paracetamol",
    category: "مزيل تشنج",
    priceEGP: 28,
    alternatives: ["Buscopan Plus", "Spasmo", "Hyoscine Generic"],
  },
  {
    brand: "Duspatalin",
    activeSubstance: "Mebeverine",
    category: "مزيل تشنج معوي",
    priceEGP: 42,
    alternatives: ["Coloverin", "Mebeverine Generic", "Spasmomen"],
  },
  {
    brand: "Motilium",
    activeSubstance: "Domperidone",
    category: "مضاد غثيان",
    priceEGP: 24,
    alternatives: ["Motinorm", "Domperidone Generic", "Emitas"],
  },
  {
    brand: "Nexium",
    activeSubstance: "Esomeprazole",
    category: "مثبط حموضة (PPI)",
    priceEGP: 95,
    alternatives: ["Esomep", "Nexpro", "Esoz"],
  },
  {
    brand: "Buscopan",
    activeSubstance: "Hyoscine Butylbromide",
    category: "مزيل تشنج",
    priceEGP: 22,
    alternatives: ["Spasmo-Canulase", "Hyoscine Generic", "Buscopan Plus"],
  },
  {
    brand: "Flagyl",
    activeSubstance: "Metronidazole",
    category: "مضاد عدوى معوية",
    priceEGP: 15,
    alternatives: ["Metronidazole Generic", "Flagyl Fort", "Trichazole"],
  },
  {
    brand: "Amoxil",
    activeSubstance: "Amoxicillin",
    category: "مضاد حيوي",
    priceEGP: 30,
    alternatives: ["Amoxicillin Generic", "Hiconcil", "Amox"],
  },
  {
    brand: "Zantac",
    activeSubstance: "Ranitidine",
    category: "مضاد حموضة (H2)",
    priceEGP: 20,
    alternatives: ["Ranitidine Generic", "Acimax", "Gastran"],
  },
  {
    brand: "Imodium",
    activeSubstance: "Loperamide",
    category: "مضاد إسهال",
    priceEGP: 26,
    alternatives: ["Loperamide Generic", "Dia-Stop", "Lopex"],
  },
  {
    brand: "Creon",
    activeSubstance: "Pancreatin",
    category: "إنزيمات هضمية",
    priceEGP: 120,
    alternatives: ["Pancreatin Generic", "Kreon", "Pangrol"],
  },
  {
    brand: "Entocort",
    activeSubstance: "Budesonide",
    category: "كورتيزون معوي",
    priceEGP: 180,
    alternatives: ["Budesonide Generic", "Budenofalk", "Cortiment"],
  },
  {
    brand: "Pepcid",
    activeSubstance: "Famotidine",
    category: "مضاد حموضة (H2)",
    priceEGP: 22,
    alternatives: ["Famotidine Generic", "Famosan", "Gaster"],
  },
  {
    brand: "Salofalk",
    activeSubstance: "Mesalazine",
    category: "علاج التهاب القولون",
    priceEGP: 140,
    alternatives: ["Mesalazine Generic", "Pentasa", "Asacol"],
  },
  {
    brand: "Debridat",
    activeSubstance: "Trimebutine",
    category: "منظم حركة الأمعاء",
    priceEGP: 38,
    alternatives: ["Trimebutine Generic", "Modulon", "Trimedat"],
  },
  {
    brand: "Meteospasmyl",
    activeSubstance: "Alverine + Simethicone",
    category: "مضاد انتفاخ",
    priceEGP: 32,
    alternatives: ["Alverine Generic", "Cyspas", "Spasfon"],
  },
  {
    brand: "Tavanic",
    activeSubstance: "Levofloxacin",
    category: "مضاد حيوي",
    priceEGP: 75,
    alternatives: ["Levofloxacin Generic", "Levoxin", "Tavanex"],
  },
  {
    brand: "Forlax",
    activeSubstance: "Macrogol 4000",
    category: "ملين",
    priceEGP: 45,
    alternatives: ["Macrogol Generic", "Transipeg", "Movicol"],
  },
];
