
import { BibleChapter } from '../types/bible.types';
import { getVersionInfo } from './bible-utils';

// This is a temporary function that will be used until we have proper data loaded
export function getChapterMock(
  book: string, 
  chapter: number,
  version: string = 'kja'
): BibleChapter {
  const bookData = {
    genesis: {
      pt: "Gênesis",
      en: "Genesis", 
      es: "Génesis"
    },
    matthew: {
      pt: "Mateus",
      en: "Matthew",
      es: "Mateo"
    }
  };

  const verses = book === 'genesis' ? [
    { number: 1, text: "No princípio criou Deus os céus e a terra." },
    { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
    { number: 3, text: "E disse Deus: Haja luz; e houve luz." },
    { number: 4, text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
    { number: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
  ] : [
    { number: 1, text: "Livro da geração de Jesus Cristo, filho de Davi, filho de Abraão." },
    { number: 2, text: "Abraão gerou a Isaque; e Isaque gerou a Jacó; e Jacó gerou a Judá e a seus irmãos;" },
    { number: 3, text: "E Judá gerou a Perez e a Zerá de Tamar; e Perez gerou a Esrom; e Esrom gerou a Arão;" },
    { number: 4, text: "E Arão gerou a Aminadab; e Aminadab gerou a Naassom; e Naassom gerou a Salmom;" },
    { number: 5, text: "E Salmom gerou a Boaz de Raabe; e Boaz gerou a Obede de Rute; e Obede gerou a Jessé;" },
  ];

  // Get localized version name based on the version ID
  const versionInfo = getVersionInfo(version);
  
  // For mock data, let's determine language based on the version
  const lang = versionInfo.language.startsWith('pt') ? 'pt' : (versionInfo.language === 'en' ? 'en' : 'es');
  const localizedBookName = book === 'genesis' ? bookData.genesis[lang] : bookData.matthew[lang];
  
  return {
    book,
    bookName: localizedBookName,
    chapter,
    verses,
    version: {
      id: version,
      name: versionInfo.name,
      language: versionInfo.language,
      language_name: versionInfo.languageName,
      is_original: false
    },
    originalLanguage: book === 'genesis' ? "hebrew" : "greek"
  };
}
