
import { supabase } from '@/integrations/supabase/client';
import { BibleStudy } from '@/types/bible.types';

/**
 * Get all Bible studies
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function getAllBibleStudies(): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error fetching Bible studies:', error);
    return [];
  }
}

/**
 * Get a Bible study by ID
 * @param id Bible study ID
 * @returns Promise resolving to BibleStudy object or null if not found
 */
export async function getBibleStudyById(id: string): Promise<BibleStudy | null> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return data as unknown as BibleStudy;
  } catch (error) {
    console.error('Error fetching Bible study:', error);
    return null;
  }
}

/**
 * Search Bible studies
 * @param query Search query
 * @returns Promise resolving to array of BibleStudy objects
 */
export async function searchBibleStudies(query: string): Promise<BibleStudy[]> {
  try {
    const { data, error } = await supabase
      .from('bible_studies')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Type casting to match our expected BibleStudy interface
    return (data || []) as unknown as BibleStudy[];
  } catch (error) {
    console.error('Error searching Bible studies:', error);
    return [];
  }
}

/**
 * Get localized study content
 * Helper function to get properly localized content from a study
 * @param study Bible study object
 * @param language Language code
 * @returns Localized content string
 */
export function getStudyContent(study: BibleStudy, language: string = 'en'): string {
  if (!study || !study.content) return '';
  
  // Para conteúdo armazenado como string direta
  if (typeof study.content === 'string') {
    // Converter Markdown para HTML se necessário
    return convertMarkdownToHTML(study.content);
  }
  
  // Para conteúdo com chaves de idioma diretamente no objeto content
  if (typeof study.content === 'object' && study.content !== null && study.content[language]) {
    return convertMarkdownToHTML(study.content[language]);
  }
  
  // Para estrutura aninhada com subcampo content
  if (typeof study.content === 'object' && study.content !== null && study.content.content) {
    const contentObj = study.content.content;
    
    if (typeof contentObj === 'string') {
      return convertMarkdownToHTML(contentObj);
    }
    
    if (contentObj && typeof contentObj === 'object') {
      // Tentar obter pelo idioma atual ou usar inglês como fallback
      const contentText = contentObj[language] || contentObj['en'] || '';
      return convertMarkdownToHTML(contentText);
    }
  }
  
  return '';
}

/**
 * Convert Markdown to HTML
 * Simple function to convert basic Markdown to HTML
 * @param markdown Markdown text
 * @returns HTML string
 */
function convertMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Substituir cabeçalhos
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Substituir ênfase (negrito, itálico)
  html = html
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\_\_(.*?)\_\_/gim, '<strong>$1</strong>')
    .replace(/\_(.*?)\_/gim, '<em>$1</em>');
  
  // Substituir links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-ancient-gold hover:underline">$1</a>');
  
  // Substituir listas
  html = html.replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>');
  html = html.replace(/^\* (.*)/gim, '<li>$1</li>');
  html = html.replace(/^\s*\n\- (.*)/gim, '<ul>\n<li>$1</li>');
  html = html.replace(/^\- (.*)/gim, '<li>$1</li>');
  
  // Quebras de linha e parágrafos
  html = html
    .replace(/^\s*\n\s*\n/gim, '</p><p>')
    .replace(/^\s*\n/gim, '<br />');
  
  // Citações
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Limpar código HTML resultante
  html = '<p>' + html + '</p>';
  html = html
    .replace(/<\/ul>\s*<p>/gim, '</ul>')
    .replace(/<\/p>\s*<ul>/gim, '<ul>')
    .replace(/<\/li>\s*<p>/gim, '</li>')
    .replace(/<\/p>\s*<li>/gim, '<li>')
    .replace(/<p>\s*<\/p>/gim, '')
    .replace(/<\/p>\s*<p>/gim, '</p><p>');
  
  return html;
}
