
// Helper function to get version information
export function getVersionInfo(versionId: string): {name: string, language: string, languageName: string} {
  const versionMap: Record<string, {name: string, language: string, languageName: string}> = {
    'kjv': {name: 'King James Version', language: 'en', languageName: 'English'},
    'kja': {name: 'King James Atualizada', language: 'pt-br', languageName: 'Português'},
    'rvr': {name: 'Reina Valera 1909', language: 'es', languageName: 'Español'},
    'apee': {name: 'Louis Segond Bible', language: 'fr', languageName: 'Français'},
    'svd': {name: 'Smith & Van Dyke', language: 'ar', languageName: 'العربية'},
  };
  
  return versionMap[versionId] || {name: versionId.toUpperCase(), language: 'en', languageName: 'English'};
}

// Helper function to get book name
export function getBookName(bookId: string): string {
  if (!bookId) return 'Unknown';
  
  // Ensure bookId is lowercase for consistent lookups
  const normalizedBookId = bookId.toLowerCase();
  
  const bookNames: Record<string, string> = {
    // Old Testament - English
    'gn': 'Genesis',
    'ex': 'Exodus',
    'lv': 'Leviticus',
    'nm': 'Numbers',
    'dt': 'Deuteronomy',
    'js': 'Joshua',
    'jud': 'Judges',
    'rt': 'Ruth',
    '1sm': '1 Samuel',
    '2sm': '2 Samuel',
    '1kgs': '1 Kings',
    '2kgs': '2 Kings',
    '1ch': '1 Chronicles',
    '2ch': '2 Chronicles',
    'ezr': 'Ezra',
    'ne': 'Nehemiah',
    'et': 'Esther',
    'job': 'Job',
    'ps': 'Psalms',
    'prv': 'Proverbs',
    'ec': 'Ecclesiastes',
    'so': 'Song of Solomon',
    'is': 'Isaiah',
    'jr': 'Jeremiah',
    'lm': 'Lamentations',
    'ez': 'Ezekiel',
    'dn': 'Daniel',
    'ho': 'Hosea',
    'jl': 'Joel',
    'am': 'Amos',
    'ob': 'Obadiah',
    'jn': 'Jonah',
    'mi': 'Micah',
    'na': 'Nahum',
    'hk': 'Habakkuk',
    'zp': 'Zephaniah',
    'hg': 'Haggai',
    'zc': 'Zechariah',
    'ml': 'Malachi',
    
    // New Testament - English
    'mt': 'Matthew',
    'mk': 'Mark',
    'lk': 'Luke',
    'jo': 'John',
    'act': 'Acts',
    'rm': 'Romans',
    '1co': '1 Corinthians',
    '2co': '2 Corinthians',
    'gl': 'Galatians',
    'eph': 'Ephesians',
    'ph': 'Philippians',
    'cl': 'Colossians',
    '1ts': '1 Thessalonians',
    '2ts': '2 Thessalonians',
    '1tm': '1 Timothy',
    '2tm': '2 Timothy',
    'tt': 'Titus',
    'phm': 'Philemon',
    'hb': 'Hebrews',
    'jm': 'James',
    '1pe': '1 Peter',
    '2pe': '2 Peter',
    '1jo': '1 John',
    '2jo': '2 John',
    '3jo': '3 John',
    'jd': 'Jude',
    're': 'Revelation',
    
    // Portuguese translations
    'genesis': 'Gênesis',
    'exodus': 'Êxodo',
    'leviticus': 'Levítico',
    'numbers': 'Números',
    'deuteronomy': 'Deuteronômio',
    'joshua': 'Josué',
    'judges': 'Juízes',
    'ruth': 'Rute',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '1kings': '1 Reis',
    '2kings': '2 Reis',
    '1chronicles': '1 Crônicas',
    '2chronicles': '2 Crônicas',
    'ezra': 'Esdras',
    'nehemiah': 'Neemias',
    'esther': 'Ester',
    'psalms': 'Salmos',
    'proverbs': 'Provérbios',
    'ecclesiastes': 'Eclesiastes',
    'songofsolomon': 'Cânticos',
    'isaiah': 'Isaías',
    'jeremiah': 'Jeremias',
    'lamentations': 'Lamentações',
    'ezekiel': 'Ezequiel',
    'daniel': 'Daniel',
    'hosea': 'Oséias',
    'joel': 'Joel',
    'amos': 'Amós',
    'obadiah': 'Obadias',
    'jonah': 'Jonas',
    'micah': 'Miquéias',
    'nahum': 'Naum',
    'habakkuk': 'Habacuque',
    'zephaniah': 'Sofonias',
    'haggai': 'Ageu',
    'zechariah': 'Zacarias',
    'malachi': 'Malaquias',
    'matthew': 'Mateus',
    'mark': 'Marcos',
    'luke': 'Lucas',
    'john': 'João',
    'acts': 'Atos',
    'romans': 'Romanos',
    '1corinthians': '1 Coríntios',
    '2corinthians': '2 Coríntios',
    'galatians': 'Gálatas',
    'ephesians': 'Efésios',
    'philippians': 'Filipenses',
    'colossians': 'Colossenses',
    '1thessalonians': '1 Tessalonicenses',
    '2thessalonians': '2 Tessalonicenses',
    '1timothy': '1 Timóteo',
    '2timothy': '2 Timóteo',
    'titus': 'Tito',
    'philemon': 'Filemom',
    'hebrews': 'Hebreus',
    'james': 'Tiago',
    '1peter': '1 Pedro',
    '2peter': '2 Pedro',
    '1john': '1 João',
    '2john': '2 João',
    '3john': '3 João',
    'jude': 'Judas',
    'revelation': 'Apocalipse'
  };
  
  return bookNames[normalizedBookId] || normalizedBookId.charAt(0).toUpperCase() + normalizedBookId.slice(1);
}

// Helper function to get a formatted reference
export function getFormattedReference(bookId: string, chapter: number, verse?: number): string {
  const bookName = getBookName(bookId);
  if (verse) {
    return `${bookName} ${chapter}:${verse}`;
  }
  return `${bookName} ${chapter}`;
}
