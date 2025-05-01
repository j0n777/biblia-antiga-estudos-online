
// Helper function to get version information
export function getVersionInfo(versionId: string): {name: string, language: string, languageName: string} {
  const versionMap: Record<string, {name: string, language: string, languageName: string}> = {
    'kjv': {name: 'King James Version', language: 'en', languageName: 'English'},
    'kja': {name: 'King James Atualizada', language: 'pt-br', languageName: 'Português'},
    'rvr': {name: 'Reina Valera 1909', language: 'es', languageName: 'Español'},
  };
  
  return versionMap[versionId] || {name: versionId.toUpperCase(), language: 'en', languageName: 'English'};
}

// Helper function to get book name
export function getBookName(bookId: string): string {
  const bookNames: Record<string, string> = {
    'genesis': 'Gênesis',
    'exodus': 'Êxodo',
    'leviticus': 'Levítico',
    'matthew': 'Mateus',
    'revelation': 'Apocalipse'
  };
  
  return bookNames[bookId] || bookId.charAt(0).toUpperCase() + bookId.slice(1);
}
